import { touchFile } from '@lib/common'
import { RedisConfig } from '@lib/redis/redis.config'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { RedisOptions, Transport } from '@nestjs/microservices'
import { Cron, CronExpression } from '@nestjs/schedule'
import {
  HealthCheckService,
  MicroserviceHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus'
import { InjectConnection } from '@nestjs/typeorm'
import { Connection } from 'typeorm'

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name)

  constructor(
    private health: HealthCheckService,
    private microservice: MicroserviceHealthIndicator,
    @Inject(RedisConfig.KEY) private redisConfig: ConfigType<typeof RedisConfig>,
    private db: TypeOrmHealthIndicator,
    @InjectConnection() private defaultConnection: Connection,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async check() {
    try {
      const result = await this.health.check([
        async () => this.db.pingCheck('database', { connection: this.defaultConnection }),
        async () =>
          this.microservice.pingCheck<RedisOptions>('redis', {
            transport: Transport.REDIS,
            options: {
              host: this.redisConfig.host,
              port: this.redisConfig.port,
              db: this.redisConfig.db,
            },
          }),
      ])
      if (result.status === 'ok') {
        touchFile('/tmp/health')
      }
    } catch (e) {
      this.logger.error(e, e.stack)
    }
  }
}
