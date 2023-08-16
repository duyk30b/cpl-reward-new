import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ChannelService } from './channel.service'
import { Channel } from '@lib/channel/entities/channel.entity'
import { DynamicLinkModule } from '@lib/dynamic-link'

@Module({
  imports: [TypeOrmModule.forFeature([Channel]), DynamicLinkModule],
  providers: [ChannelService],
  exports: [ChannelService],
})
export class ChannelModule {}
