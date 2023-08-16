import { Controller } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GrpcMethod, RedisOptions, Transport } from '@nestjs/microservices'
import {
  HealthCheckService,
  MicroserviceHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus'
import { InjectConnection } from '@nestjs/typeorm'
import { Connection } from 'typeorm'

enum ServingStatus {
  UNKNOWN = 0,
  SERVING = 1,
  NOT_SERVING = 2,
}

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private microservice: MicroserviceHealthIndicator,
    private configService: ConfigService,
    private db: TypeOrmHealthIndicator,
    @InjectConnection()
    private defaultConnection: Connection,
  ) {}

  @GrpcMethod('Health', 'Check')
  async Check() {
    const result = await this.health.check([
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
    if (result.status != 'ok') return { status: ServingStatus.NOT_SERVING }
    return { status: ServingStatus.SERVING }
  }
}
