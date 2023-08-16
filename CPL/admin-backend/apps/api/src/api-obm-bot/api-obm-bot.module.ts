import { ObmBotIdModule } from '@lib/grpc-client/obm-bot-id'
import { UserModule } from '@lib/grpc-client/user'
import { Module } from '@nestjs/common'
import { AbilityModule } from '../ability/ability.module'
import { ApiObmBotController } from './api-obm-bot.controller'
import { ApiObmBotService } from './api-obm-bot.service'

@Module({
  imports: [ObmBotIdModule, AbilityModule, UserModule],
  controllers: [ApiObmBotController],
  providers: [ApiObmBotService],
})
export class ApiObmBotModule {}
