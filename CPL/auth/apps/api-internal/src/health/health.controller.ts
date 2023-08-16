import { Controller, Get } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { KafkaOptions, RedisOptions, Transport } from '@nestjs/microservices'
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
    @InjectConnection()
    private defaultConnection: Connection,
    private configService: ConfigService,
    private microservice: MicroserviceHealthIndicator,
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
            host: this.configService.get('redis_config.host'),
            port: this.configService.get('redis_config.port'),
            db: this.configService.get('redis_config.db'),
          },
        }),
      // async () =>
      //   this.microservice.pingCheck<KafkaOptions>('kafka', {
      //     transport: Transport.KAFKA,
      //     timeout: 10000,
      //     options: {
      //       client: {
      //         brokers: this.configService.get('kafka_brokers'),
      //       },
      //     },
      //   }),
    ])
  }
}
