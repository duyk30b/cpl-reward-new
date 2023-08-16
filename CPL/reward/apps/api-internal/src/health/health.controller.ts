import { RedisConfig } from '@lib/redis/redis.config'
import { Controller, Get, Inject } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { RedisOptions, Transport } from '@nestjs/microservices'
import { ApiTags } from '@nestjs/swagger'
import {
  HealthCheck,
  HealthCheckService,
  MicroserviceHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus'
import { InjectConnection } from '@nestjs/typeorm'
import { Connection } from 'typeorm'

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private microservice: MicroserviceHealthIndicator,
    @Inject(RedisConfig.KEY) private redisConfig: ConfigType<typeof RedisConfig>,
    private readonly db: TypeOrmHealthIndicator,
    @InjectConnection() private defaultConnection: Connection,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database', { connection: this.defaultConnection }),
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
  }
}
