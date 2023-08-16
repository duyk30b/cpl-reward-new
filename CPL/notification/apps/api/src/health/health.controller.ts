import { Controller, Get } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { RedisOptions, Transport } from '@nestjs/microservices'
import {
  HealthCheckService,
  HealthCheck,
  TypeOrmHealthIndicator,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus'
import { InjectConnection } from '@nestjs/typeorm'
import { Connection } from 'typeorm'

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private microservice: MicroserviceHealthIndicator,
    private readonly configService: ConfigService,
    @InjectConnection()
    private defaultConnection: Connection,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () =>
        this.db.pingCheck('database', { connection: this.defaultConnection }),
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
  }
}
