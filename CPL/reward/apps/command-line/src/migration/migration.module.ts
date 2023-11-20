import { BullQueueModule } from '@lib/redis'
import { RedisConfig } from '@lib/redis/redis.config'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { RedisQueueMigrate } from './redis-queue.migrate'

@Module({
  imports: [
    ConfigModule.forFeature(RedisConfig),
    BullQueueModule.forRoot(),
    BullQueueModule.registerProducer(),
  ],
  providers: [RedisQueueMigrate],
})
export class MigrationModule {}
