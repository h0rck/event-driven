import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RabbitMQService } from '../services/rabbitmq.service';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RabbitGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private rabbitMQService: RabbitMQService) { }

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    // Enviar lista inicial de filas
    const queues = await this.rabbitMQService.getQueues();
    client.emit('queues', queues);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('getQueueInfo')
  async handleGetQueueInfo(client: Socket, queueName: string) {
    const queueInfo = await this.rabbitMQService.getQueueInfo(queueName);
    client.emit('queueInfo', queueInfo);
  }

  @SubscribeMessage('subscribeToQueue')
  async handleSubscribeToQueue(client: Socket, queueName: string) {
    await this.rabbitMQService.subscribeToQueue(queueName, (message) => {
      client.emit('queueMessage', { queue: queueName, message });
    });
  }
}
