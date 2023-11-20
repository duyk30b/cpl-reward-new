import { RedisConfig } from '@lib/redis/redis.config'
import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TerminusModule } from '@nestjs/terminus'
import { HealthController } from './health.controller'

@Module({
  imports: [TerminusModule, ConfigModule.forFeature(RedisConfig), HttpModule],
  controllers: [HealthController],
})
export class HealthModule {}
