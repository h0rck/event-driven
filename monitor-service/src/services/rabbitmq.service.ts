import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async onModuleInit() {
    try {
      this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost:5672');
      this.channel = await this.connection.createChannel();
      console.log('Connected to RabbitMQ');
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
    }
  }

  async getQueues(): Promise<any[]> {
    try {
      const response = await fetch('http://localhost:15672/api/queues', {
        headers: {
          Authorization: 'Basic ' + Buffer.from('guest:guest').toString('base64'),
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching queues:', error);
      return [];
    }
  }

  async getQueueInfo(queueName: string): Promise<any> {
    try {
      const response = await fetch(`http://localhost:15672/api/queues/%2F/${queueName}`, {
        headers: {
          Authorization: 'Basic ' + Buffer.from('guest:guest').toString('base64'),
        },
      });
      return await response.json();
    } catch (error) {
      console.error(`Error fetching queue info for ${queueName}:`, error);
      return null;
    }
  }

  async subscribeToQueue(queueName: string, callback: (message: any) => void) {
    try {
      await this.channel.assertQueue(queueName, { durable: true });
      this.channel.consume(queueName, (message) => {
        if (message) {
          const content = JSON.parse(message.content.toString());
          callback(content);
          this.channel.ack(message);
        }
      });
    } catch (error) {
      console.error(`Error subscribing to queue ${queueName}:`, error);
    }
  }
}
