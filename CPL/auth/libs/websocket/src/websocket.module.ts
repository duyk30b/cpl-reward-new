import { Module } from '@nestjs/common'
import { WebsocketService } from './websocket.service'
import { ConfigModule } from '@nestjs/config'
import emqx from 'config/emqx'

@Module({
  imports: [ConfigModule.forRoot({ load: [emqx] })],
  providers: [WebsocketService],
  exports: [WebsocketService],
})
export class WebsocketModule {}
