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

  mainWindow.loadURL(FRONTEND_URL);

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
      examSessionId: 'unknown',
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
  wsClient = io(`${BACKEND_WS_BASE}/proctoring`, {
    transports: ['websocket']
  });

  wsClient.on('connect', () => {
    forwardLog({ level: 'info', message: 'Proctoring socket connected', context: { id: wsClient?.id } });
  });

  wsClient.on('disconnect', (reason) => {
    forwardLog({ level: 'warn', message: 'Proctoring socket disconnected', context: { reason } });
  });
}

function sendProctoringEvent(event: { examSessionId: string; eventType: string; payload?: Record<string, unknown> }) {
  if (!wsClient) connectProctoringSocket();
  wsClient?.emit('proctoring:event', event);
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
  createWindow();
  registerShortcuts();
  hardenSession();
  connectProctoringSocket();

  ipcMain.handle('client-log', async (_event, payload: ClientLogPayload) => {
    await forwardLog(payload);
    return { queued: pendingLogs.length };
  });

  ipcMain.handle('flush-offline', async () => {
    await flushOfflineLogs();
    return { queued: pendingLogs.length };
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
});
