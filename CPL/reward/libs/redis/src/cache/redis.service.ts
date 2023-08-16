import { Injectable } from '@nestjs/common'
import { InjectRedis, Redis } from '@nestjs-modules/ioredis'

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async get(key: string): Promise<string | number> {
    return await this.redis.get(key)
  }

  async set(key: string, value: any, ttlInSeconds?: number) {
    if (ttlInSeconds != null) {
      await this.redis.set(key, value, 'EX', ttlInSeconds)
    } else {
      await this.redis.set(key, value)
    }
  }

  async del(key: string) {
    await this.redis.del(key)
  }

  async reset() {
    await this.redis.reset()
  }
}
