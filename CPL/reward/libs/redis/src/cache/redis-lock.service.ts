import { InjectRedis, Redis } from '@nestjs-modules/ioredis'
import { Injectable } from '@nestjs/common'
import Redlock, { Settings } from 'redlock'

@Injectable()
export class RedisLockService {
  private readonly redlock: Redlock

  constructor(@InjectRedis() private readonly redis: Redis) {
    this.redlock = new Redlock([this.redis], {
      retryJitter: 200,
    })
  }

  async acquire(keys: string[], duration: number, settings?: Partial<Settings>) {
    return await this.redlock.acquire(keys, duration, settings)
  }
}
