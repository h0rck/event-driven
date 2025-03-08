import { Module } from '@nestjs/common';
import { QueueMonitorGateway } from './queue-monitor.gateway';
import { RabbitMQService } from '../services/rabbitmq.service';

@Module({
  providers: [QueueMonitorGateway, RabbitMQService],
  exports: [QueueMonitorGateway],
})
export class WebsocketModule { }
