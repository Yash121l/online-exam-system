import { contextBridge, ipcRenderer } from 'electron';

type ClientLogPayload = {
  level: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  message: string;
  context?: Record<string, unknown>;
};

contextBridge.exposeInMainWorld('aegisExam', {
  log: (payload: ClientLogPayload) => ipcRenderer.invoke('client-log', payload),
  flushOffline: () => ipcRenderer.invoke('flush-offline')
});

declare global {
  interface Window {
    aegisExam: {
      log: (payload: ClientLogPayload) => Promise<{ queued: number }>;
      flushOffline: () => Promise<{ queued: number }>;
    };
  }
}
