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
        examSessionId: payload.examSessionId
      },
      'Proctoring event ingested'
    );

    void this.proctoringService.ingestEvent({
      examSessionId: payload.examSessionId,
      eventType: payload.eventType,
      payload: payload.payload
    });
    void this.socketLogService.log({
      eventType: payload.eventType,
      socketId: client.id,
      payload: payload.payload
    });

    (client.data as { lastSessionId?: string }).lastSessionId = payload.examSessionId;
    this.updateStatus(payload.examSessionId, {
      cameraActive: payload.eventType.includes('webcam'),
      micActive: payload.eventType.includes('audio'),
      screenActive: payload.eventType.includes('screen'),
      flags: (payload.payload as { flags?: string[] } | undefined)?.flags,
      online: true
    });

    return { ack: true, receivedAt: Date.now() };
  }

  private updateStatus(
    examSessionId: string,
    updates: Partial<{ cameraActive: boolean; micActive: boolean; screenActive: boolean; flags: string[]; online: boolean }>
  ) {
    const current = this.sessionStatus.get(examSessionId) ?? {
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
    this.sessionStatus.set(examSessionId, next);
    this.broadcastStatus(examSessionId, next);
  }

  private broadcastStatus(
    examSessionId: string,
    status: {
      cameraActive: boolean;
      micActive: boolean;
      screenActive: boolean;
      flags: string[];
      online: boolean;
      lastEventAt?: number;
    }
  ) {
    this.logger.debug({ examSessionId, status }, 'Proctoring status update');
    void this.socketLogService.log({ eventType: 'proctoring.status', socketId: 'broadcast', payload: { examSessionId, status } });
    (this as any).server?.emit('proctoring:status', { examSessionId, ...status });
  }
}
