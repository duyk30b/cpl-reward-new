import { Module } from '@nestjs/common'
import { InternalChannelController } from './internal-channel.controller'
import { InternalChannelService } from './internal-channel.service'
import { ChannelModule } from '@lib/channel'
import { TagModule } from '@lib/tag'

@Module({
  imports: [ChannelModule, TagModule],
  controllers: [InternalChannelController],
  providers: [InternalChannelService],
})
export class InternalChannelModule {}
