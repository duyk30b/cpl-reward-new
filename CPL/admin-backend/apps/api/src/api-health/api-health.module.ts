import { Module } from '@nestjs/common'
import { ApiHealthController } from './api-health.controller'
import { TerminusModule } from '@nestjs/terminus'

@Module({
  imports: [TerminusModule],
  controllers: [ApiHealthController],
})
export class ApiHealthModule {}
