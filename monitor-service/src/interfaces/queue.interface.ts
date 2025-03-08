import { MessageProperties } from 'amqplib';

export interface QueueInfo {
  name: string;
  messages: number;
  consumers: number;
  state: string;
}

export interface QueueMessage {
  queue: string;
  message: any;
  properties: MessageProperties;
}
