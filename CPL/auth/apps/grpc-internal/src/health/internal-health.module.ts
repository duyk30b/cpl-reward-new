import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { TerminusModule } from '@nestjs/terminus'
import { InternalHealthController } from './internal-health.controller'

@Module({
  imports: [TerminusModule, ConfigModule, ScheduleModule.forRoot()],
  controllers: [InternalHealthController],
})
export class InternalHealthModule {}
