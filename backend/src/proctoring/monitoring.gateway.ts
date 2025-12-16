import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Logger } from 'nestjs-pino';
import { Server, Socket } from 'socket.io';
import { SocketLogService } from '../logs/socket-log.service';

@WebSocketGateway({
  namespace: '/monitoring',
  cors: { origin: '*' }
})
export class MonitoringGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly logger: Logger, private readonly socketLogService: SocketLogService) {}

  handleConnection(client: Socket) {
    this.logger.log({ clientId: client.id }, 'Monitoring gateway connected');
    void this.socketLogService.log({ eventType: 'monitoring.connect', socketId: client.id });
  }

  handleDisconnect(client: Socket) {
    this.logger.log({ clientId: client.id }, 'Monitoring gateway disconnected');
    void this.socketLogService.log({ eventType: 'monitoring.disconnect', socketId: client.id });
  }

  emitTileUpdate(payload: {
    sessionId: string;
    lastFrameType: 'webcam' | 'screen' | 'audio' | null;
    flags: string[];
    framesProcessed: number;
    lastUpdate: number;
  }) {
    this.server.emit('monitoring:tile', payload);
  }

  emitFlag(payload: { sessionId: string; flags: string[]; at: number }) {
    this.server.emit('monitoring:flag', payload);
  }

  emitSummary(payload: { sessionId: string; summary: Record<string, unknown> }) {
    this.server.emit('monitoring:summary', payload);
  }

  @SubscribeMessage('chat:send')
  handleChatMessage(
    @MessageBody() payload: { sessionId: string; from: string; message: string },
    @ConnectedSocket() client: Socket
  ) {
    this.logger.log({ ...payload, clientId: client.id }, 'Proctoring chat');
    void this.socketLogService.log({ eventType: 'monitoring.chat', socketId: client.id, payload });
    this.server.emit('chat:message', { ...payload, at: Date.now() });
    return { delivered: true };
  }
}
