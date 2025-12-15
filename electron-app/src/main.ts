import { app, BrowserWindow, globalShortcut, ipcMain, shell, session, systemPreferences, desktopCapturer } from 'electron';
import { join } from 'path';
import os from 'os';
import { io, Socket } from 'socket.io-client';

type ClientLogPayload = {
  level: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  message: string;
  context?: Record<string, unknown>;
};

const BACKEND_URL = process.env.AEGISEXAM_API_URL ?? 'http://localhost:3001/api';
const FRONTEND_URL = process.env.AEGISEXAM_FRONTEND_URL ?? 'http://localhost:3000';
const BACKEND_WS_BASE = BACKEND_URL.replace(/\/api$/, '');
const pendingLogs: ClientLogPayload[] = [];
let mainWindow: BrowserWindow | null = null;
let monitorInterval: NodeJS.Timeout | null = null;
let wsClient: Socket | null = null;
let frameFlushInterval: NodeJS.Timeout | null = null;
let sessionToken: string | null = null;
let launchSessionId: string | null = null;
let launchExamId: string | null = null;
const pendingFrames: Array<{ examSessionId: string; frameType: 'webcam' | 'screen' | 'audio'; data: string; sequence?: number }> = [];
const MAX_PENDING_FRAMES = 30;

async function forwardLog(payload: ClientLogPayload) {
  try {
    await fetch(`${BACKEND_URL}/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'electron',
        ...payload
      })
    });
  } catch (error) {
    pendingLogs.push(payload);
  }
}

async function flushOfflineLogs() {
  if (!pendingLogs.length) return;
  const toSend = [...pendingLogs];
  pendingLogs.length = 0;
  for (const payload of toSend) {
    await forwardLog(payload);
  }
}

function buildFrontendUrl() {
  const url = new URL(FRONTEND_URL);
  if (sessionToken) url.searchParams.set('sessionToken', sessionToken);
  if (launchSessionId) url.searchParams.set('examSessionId', launchSessionId);
  if (launchExamId) url.searchParams.set('examId', launchExamId);
  return url.toString();
}

function captureLaunchParams(urlOrArgs: string) {
  try {
    const parsed = new URL(urlOrArgs);
    if (!parsed.protocol.startsWith('aegisexam')) return;
    sessionToken = parsed.searchParams.get('token') ?? sessionToken;
    launchSessionId = parsed.searchParams.get('sessionId') ?? launchSessionId;
    launchExamId = parsed.searchParams.get('examId') ?? launchExamId;
    reconnectProctoringSocket();
    if (mainWindow) {
      mainWindow.loadURL(buildFrontendUrl());
    }
  } catch (err) {
    forwardLog({ level: 'warn', message: 'Failed to parse launch parameters', context: { err: String(err) } });
  }
}

function hydrateFromArgv(argv: string[]) {
  argv.forEach((arg) => {
    if (arg.startsWith('aegisexam://')) captureLaunchParams(arg);
    if (arg.startsWith('--sessionToken=')) sessionToken = arg.split('=')[1];
    if (arg.startsWith('--sessionId=')) launchSessionId = arg.split('=')[1];
    if (arg.startsWith('--examId=')) launchExamId = arg.split('=')[1];
  });
  if (sessionToken || launchSessionId) {
    reconnectProctoringSocket();
  }
}

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

app.on('second-instance', (_event, argv) => {
  hydrateFromArgv(argv);
  if (mainWindow) {
    mainWindow.loadURL(buildFrontendUrl());
    mainWindow.focus();
  }
});

app.on('open-url', (event, url) => {
  event.preventDefault();
  captureLaunchParams(url);
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    fullscreen: true,
    kiosk: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  mainWindow.loadURL(buildFrontendUrl());

  mainWindow.on('blur', () =>
    forwardLog({
      level: 'warn',
      message: 'Window lost focus'
    })
  );

  mainWindow.on('focus', () =>
    forwardLog({
      level: 'info',
      message: 'Window regained focus'
    })
  );
}

function registerShortcuts() {
  const blocked = ['CommandOrControl+R', 'CommandOrControl+Shift+R', 'F11', 'Alt+Tab'];
  blocked.forEach((accelerator) => {
    globalShortcut.register(accelerator, () => {
      forwardLog({
        level: 'warn',
        message: `Blocked accelerator ${accelerator}`
      });
    });
  });

  globalShortcut.register('PrintScreen', () => {
    forwardLog({
      level: 'warn',
      message: 'Print Screen attempted'
    });
    sendProctoringEvent({
      examSessionId: activeExamSessionId(),
      eventType: 'shortcut.printscreen',
      payload: { ts: Date.now() }
    });
  });
}

function detectRdpOrVm() {
  const envIndicators = [
    process.env.SSH_CONNECTION,
    process.env.RDP_SESSION,
    process.env.SESSIONNAME
  ]
    .filter(Boolean)
    .join(' ');
  const platformRelease = os.release().toLowerCase();
  const cpuModel = os.cpus()[0]?.model?.toLowerCase() ?? '';

  if (
    envIndicators.includes('rdp') ||
    envIndicators.includes('ssh') ||
    platformRelease.includes('microsoft') ||
    cpuModel.includes('virtualbox') ||
    cpuModel.includes('vmware') ||
    cpuModel.includes('hyper-v')
  ) {
    forwardLog({
      level: 'warn',
      message: 'Potential RDP/VM environment detected',
      context: { envIndicators, platformRelease, cpuModel }
    });
  }
}

async function monitorScreenCapture() {
  try {
    const sources = await desktopCapturer.getSources({ types: ['screen'] });
    const hasMultipleCaptures = sources.length > 1;
    forwardLog({
      level: 'info',
      message: 'Screen capture poll',
      context: { sources: sources.map((s) => s.name), hasMultipleCaptures }
    });
  } catch (error) {
    forwardLog({
      level: 'error',
      message: 'Screen capture detection failed',
      context: { error: String(error) }
    });
  }
}

function connectProctoringSocket() {
  if (wsClient) return;
  const authPayload = sessionToken
    ? {
        sessionToken,
        examSessionId: launchSessionId
      }
    : undefined;
  wsClient = io(`${BACKEND_WS_BASE}/proctoring`, {
    transports: ['websocket'],
    auth: authPayload
  });

  wsClient.on('connect', () => {
    forwardLog({ level: 'info', message: 'Proctoring socket connected', context: { id: wsClient?.id } });
  });

  wsClient.on('disconnect', (reason) => {
    forwardLog({ level: 'warn', message: 'Proctoring socket disconnected', context: { reason } });
  });
}

function activeExamSessionId() {
  return launchSessionId ?? 'unknown';
}

function reconnectProctoringSocket() {
  if (wsClient) {
    wsClient.disconnect();
    wsClient = null;
  }
  connectProctoringSocket();
}

function sendProctoringEvent(event: { examSessionId: string; eventType: string; payload?: Record<string, unknown> }) {
  if (!wsClient) connectProctoringSocket();
  wsClient?.emit('proctoring:event', event);
}

function enqueueProctoringFrame(frame: { examSessionId: string; frameType: 'webcam' | 'screen' | 'audio'; data: string; sequence?: number }) {
  if (pendingFrames.length >= MAX_PENDING_FRAMES) {
    pendingFrames.shift();
  }
  pendingFrames.push(frame);
}

function flushFrames() {
  if (!pendingFrames.length) return;
  if (!wsClient) connectProctoringSocket();
  const frame = pendingFrames.shift();
  if (!frame) return;
  wsClient?.emit('proctoring:event', {
    examSessionId: frame.examSessionId,
    eventType: `stream.${frame.frameType}`,
    payload: { data: frame.data, sequence: frame.sequence }
  });
}

function hardenSession() {
  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
    if (permission === 'media') {
      callback(true);
      return;
    }
    callback(false);
  });

  app.on('web-contents-created', (_event, contents) => {
    contents.setWindowOpenHandler(() => ({ action: 'deny' }));
    contents.on('will-navigate', (e, url) => {
      if (!url.startsWith(FRONTEND_URL)) {
        e.preventDefault();
        shell.openExternal(url);
      }
    });
  });

  detectRdpOrVm();
  monitorInterval = setInterval(() => {
    detectRdpOrVm();
    void monitorScreenCapture();
  }, 45000);
}

app.whenReady().then(() => {
  if (!gotTheLock) return;
  hydrateFromArgv(process.argv);
  createWindow();
  registerShortcuts();
  hardenSession();
  if (!app.isDefaultProtocolClient('aegisexam')) {
    app.setAsDefaultProtocolClient('aegisexam');
  }
  connectProctoringSocket();
  frameFlushInterval = setInterval(flushFrames, 500);

  ipcMain.handle('client-log', async (_event, payload: ClientLogPayload) => {
    await forwardLog(payload);
    return { queued: pendingLogs.length };
  });

  ipcMain.handle('flush-offline', async () => {
    await flushOfflineLogs();
    return { queued: pendingLogs.length };
  });

  ipcMain.handle('stream-frame', async (_event, payload: { examSessionId: string; frameType: 'webcam' | 'screen' | 'audio'; data: string; sequence?: number }) => {
    enqueueProctoringFrame(payload);
    return { buffered: pendingFrames.length };
  });

  setInterval(() => {
    void flushOfflineLogs();
  }, 30000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
  if (monitorInterval) {
    clearInterval(monitorInterval);
  }
  if (frameFlushInterval) {
    clearInterval(frameFlushInterval);
  }
});
