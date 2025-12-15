import { io, Socket } from 'socket.io-client';
import { config } from './config';

type ProctoringEvent = {
  examSessionId: string;
  eventType: string;
  payload?: Record<string, unknown>;
};

class ProctoringClient {
  private socket: Socket | null = null;

  connect() {
    if (this.socket) return;
    this.socket = io(config.wsUrl, { transports: ['websocket'] });
  }

  sendEvent(event: ProctoringEvent) {
    if (!this.socket) this.connect();
    this.socket?.emit('proctoring:event', event);
  }

  onEvent(cb: (event: ProctoringEvent) => void) {
    if (!this.socket) this.connect();
    this.socket?.on('proctoring:event', cb);
  }
}

export const proctoringClient = new ProctoringClient();
