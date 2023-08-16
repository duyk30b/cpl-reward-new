import { Module } from '@nestjs/common'
import { WebsocketService } from './websocket.service'
import { ConfigModule } from '@nestjs/config'
import websocketConfig from './websocket.config'

@Module({
  imports: [ConfigModule.forRoot({ load: [websocketConfig] })],
  providers: [WebsocketService],
  exports: [WebsocketService],
})
export class WebsocketModule {}
