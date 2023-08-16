import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import {
  HealthCheckService,
  MicroserviceHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus'
import { ConfigService } from '@nestjs/config'
import { RedisOptions, Transport } from '@nestjs/microservices'
import { InjectConnection } from '@nestjs/typeorm'
import { Connection } from 'typeorm'
import { touchFile } from '@libs/util'

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name)

  constructor(
    private health: HealthCheckService,
    private microservice: MicroserviceHealthIndicator,
    private readonly configService: ConfigService,
    private db: TypeOrmHealthIndicator,
    @InjectConnection()
    private defaultConnection: Connection,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async check() {
    try {
      const result = await this.health.check([
        async () =>
          this.db.pingCheck('database', {
            connection: this.defaultConnection,
          }),
        async () =>
          this.microservice.pingCheck<RedisOptions>('redis', {
            transport: Transport.REDIS,
            options: {
              host: this.configService.get('redis.host'),
              port: this.configService.get('redis.port'),
              db: this.configService.get('redis.db'),
            },
          }),
      ])
      if (result.status == 'ok') {
        touchFile('/tmp/health')
      }
    } catch (e) {
      this.logger.error(e, e.stack)
    }
  }
}
