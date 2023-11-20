import { RedisConfig } from '@lib/redis/redis.config'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { TerminusModule } from '@nestjs/terminus'
import { HealthService } from './health.service'

@Module({
  imports: [TerminusModule, ConfigModule.forFeature(RedisConfig), ScheduleModule.forRoot()],
  providers: [HealthService],
})
export class HealthModule {}
