import * as amqp from 'amqplib';
import { QueueInfo, QueueMessage } from '../interfaces/queue.interface';

export class RabbitMQService {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      // @ts-ignore
      this.connection = await amqp.connect(process.env.RABBITMQ_URI || 'amqp://localhost:5672');
      // @ts-ignore
      this.channel = await this.connection.createChannel();
      console.log('Connected to RabbitMQ');
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
    }
  }

  async getQueues(): Promise<QueueInfo[]> {
    try {
      const response = await fetch('http://localhost:15672/api/queues', {
        headers: {
          Authorization: 'Basic ' + Buffer.from('guest:guest').toString('base64'),
        },
      });
      const data = await response.json();
      return data as QueueInfo[];
    } catch (error) {
      console.error('Error fetching queues:', error);
      return [];
    }
  }

  async getQueueInfo(queueName: string): Promise<QueueInfo | null> {
    try {
      const response = await fetch(`http://localhost:15672/api/queues/%2F/${queueName}`, {
        headers: {
          Authorization: 'Basic ' + Buffer.from('guest:guest').toString('base64'),
        },
      });
      const data = await response.json();
      return data as QueueInfo;
    } catch (error) {
      console.error(`Error fetching queue info for ${queueName}:`, error);
      return null;
    }
  }

  async subscribeToQueue(queueName: string, callback: (message: QueueMessage) => void) {
    try {
      await this.channel.assertQueue(queueName, { durable: true });
      this.channel.consume(queueName, (message) => {
        if (message) {
          const content = JSON.parse(message.content.toString());
          callback({
            queue: queueName,
            message: content,
            properties: message.properties
          });
          this.channel.ack(message);
        }
      });
    } catch (error) {
      console.error(`Error subscribing to queue ${queueName}:`, error);
    }
  }
}
