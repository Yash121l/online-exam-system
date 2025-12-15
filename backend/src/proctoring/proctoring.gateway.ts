import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
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

    return { ack: true, receivedAt: Date.now() };
  }
}
