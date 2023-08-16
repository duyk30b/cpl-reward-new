import { Module } from '@nestjs/common'
import { LogModule } from 'libs/log/src'
import { AbilityModule } from '../ability/ability.module'
import { ApiLogController } from './api-log.controller'

@Module({
  imports: [LogModule, AbilityModule],
  controllers: [ApiLogController],
})
export class ApiLogModule {}
