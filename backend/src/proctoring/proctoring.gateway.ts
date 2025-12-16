import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from 'nestjs-pino';
import { ProctoringEventDto } from './dto/proctoring-event.dto';
import { ProctoringService } from './proctoring.service';
import { SocketLogService } from '../logs/socket-log.service';

@WebSocketGateway({
  namespace: '/proctoring',
  cors: {
    origin: '*'
  }
})
export class ProctoringGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private sessionStatus = new Map<
    string,
    {
      cameraActive: boolean;
      micActive: boolean;
      screenActive: boolean;
      flags: string[];
      lastEventAt?: number;
      online: boolean;
    }
  >();

  constructor(
    private readonly logger: Logger,
    private readonly proctoringService: ProctoringService,
    private readonly socketLogService: SocketLogService
  ) {}

  handleConnection(client: Socket) {
    this.logger.log({ clientId: client.id }, 'Proctoring gateway connected');
    void this.socketLogService.log({ eventType: 'socket.connect', socketId: client.id });
  }

  handleDisconnect(client: Socket) {
    this.logger.log({ clientId: client.id }, 'Proctoring gateway disconnected');
    void this.socketLogService.log({ eventType: 'socket.disconnect', socketId: client.id });
    const lastSessionId = (client.data as { lastSessionId?: string })?.lastSessionId;
    if (lastSessionId) {
      this.updateStatus(lastSessionId, { online: false });
    }
  }

  @SubscribeMessage('proctoring:event')
  handleProctoringEvent(
    @MessageBody() payload: ProctoringEventDto,
    @ConnectedSocket() client: Socket
  ) {
    this.logger.log(
      {
        clientId: client.id,
        eventType: payload.eventType,
        sessionId: payload.sessionId
      },
      'Proctoring event ingested'
    );

    void this.proctoringService.ingestEvent({
      eventType: payload.eventType,
      sessionId: payload.sessionId,
      severity: payload.severity,
      description: payload.description,
      metadata: payload.metadata,
      snapshotUrl: payload.snapshotUrl
    });
    void this.socketLogService.log({
      eventType: payload.eventType,
      socketId: client.id,
      payload: payload.metadata
    });

    (client.data as { lastSessionId?: string }).lastSessionId = payload.sessionId;
    this.updateStatus(payload.sessionId, {
      cameraActive: payload.eventType.includes('webcam'),
      micActive: payload.eventType.includes('audio'),
      screenActive: payload.eventType.includes('screen'),
      flags: (payload.metadata as { flags?: string[] } | undefined)?.flags,
      online: true
    });

    return { ack: true, receivedAt: Date.now() };
  }

  private updateStatus(
    sessionId: string,
    updates: Partial<{ cameraActive: boolean; micActive: boolean; screenActive: boolean; flags: string[]; online: boolean }>
  ) {
    const current = this.sessionStatus.get(sessionId) ?? {
      cameraActive: false,
      micActive: false,
      screenActive: false,
      flags: [],
      online: false
    };
    const next = {
      ...current,
      ...updates,
      lastEventAt: Date.now()
    };
    if (updates.flags) {
      next.flags = updates.flags;
    }
    this.sessionStatus.set(sessionId, next);
    this.broadcastStatus(sessionId, next);
  }

  private broadcastStatus(
    sessionId: string,
    status: {
      cameraActive: boolean;
      micActive: boolean;
      screenActive: boolean;
      flags: string[];
      online: boolean;
      lastEventAt?: number;
    }
  ) {
    this.logger.debug({ sessionId, status }, 'Proctoring status update');
    void this.socketLogService.log({ eventType: 'proctoring.status', socketId: 'broadcast', payload: { sessionId, status } });
    (this as any).server?.emit('proctoring:status', { sessionId, ...status });
  }
}
