import { Module } from '@nestjs/common';
import { WebsocketModule } from './websocket/websocket.module';
// ...existing imports...

@Module({
  imports: [
    // ...existing imports...
    WebsocketModule,
  ],
  // ...existing code...
})
export class AppModule { }
