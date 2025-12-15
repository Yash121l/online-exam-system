import { io, Socket } from 'socket.io-client';
import { config } from './config';

export type MonitoringTile = {
  examSessionId: string;
  lastFrameType: 'webcam' | 'screen' | 'audio' | null;
  flags: string[];
  framesProcessed: number;
  lastUpdate: number;
  summary?: Record<string, unknown>;
};

export type MonitoringSummary = {
  examSessionId: string;
  summary: Record<string, unknown>;
};

class MonitoringClient {
  private socket: Socket | null = null;

  connect() {
    if (this.socket) return;
    this.socket = io(config.monitoringWsUrl, { transports: ['websocket'] });
  }

  onTile(cb: (tile: MonitoringTile) => void) {
    if (!this.socket) this.connect();
    this.socket?.on('monitoring:tile', cb);
  }

  onFlag(cb: (payload: { examSessionId: string; flags: string[]; at: number }) => void) {
    if (!this.socket) this.connect();
    this.socket?.on('monitoring:flag', cb);
  }

  onSummary(cb: (payload: MonitoringSummary) => void) {
    if (!this.socket) this.connect();
    this.socket?.on('monitoring:summary', cb);
  }

  sendChat(payload: { examSessionId: string; from: string; message: string }) {
    if (!this.socket) this.connect();
    this.socket?.emit('chat:send', payload);
  }

  onChat(cb: (payload: { examSessionId: string; from: string; message: string; at: number }) => void) {
    if (!this.socket) this.connect();
    this.socket?.on('chat:message', cb);
  }
}

export const monitoringClient = new MonitoringClient();
