import { Injectable } from '@nestjs/common'
import { BullOptionsFactory, BullModuleOptions } from '@nestjs/bull'
import { ConfigService } from '@nestjs/config'
import * as Redis from 'ioredis'

@Injectable()
export class WorkerLanguageOptionsFactory implements BullOptionsFactory {
  public constructor(private configService: ConfigService) {}

  public createBullOptions(): BullModuleOptions {
    const password = this.configService.get<string>('redis_config.password')
    const option: Redis.RedisOptions = {
      host: this.configService.get<string>('redis_config.host'),
      port: this.configService.get<number>('redis_config.port'),
      db: this.configService.get<number>('redis_config.db'),
    }
    if (password) {
      option.password = password
    }
    return {
      redis: option,
    }
  }
}
