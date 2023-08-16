import { Module } from '@nestjs/common'
import { AuthChannelController } from './auth-channel.controller'
import { AuthChannelService } from './auth-channel.service'
import { ChannelModule } from '@lib/channel'

@Module({
  imports: [ChannelModule],
  controllers: [AuthChannelController],
  providers: [AuthChannelService],
})
export class AuthChannelModule {}
