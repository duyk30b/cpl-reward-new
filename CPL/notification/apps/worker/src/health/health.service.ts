import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule'
import {
  HealthCheckService,
  MicroserviceHealthIndicator,
  MongooseHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus'
import { ConfigService } from '@nestjs/config'
import { RedisOptions, Transport } from '@nestjs/microservices'
import { InjectConnection } from '@nestjs/typeorm'
import { Connection } from 'typeorm'
import { touchFile } from '@libs/util'
import { InjectConnection as InjectMongoConnection } from '@nestjs/mongoose'
import { Connection as MongoConnection } from 'typeorm'

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name)

  constructor(
    private health: HealthCheckService,
    private microservice: MicroserviceHealthIndicator,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly configService: ConfigService,
    private mongooseHealth: MongooseHealthIndicator,
    private db: TypeOrmHealthIndicator,
    @InjectConnection()
    private defaultConnection: Connection,
    @InjectMongoConnection()
    private mongoConnection: MongoConnection,
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
          this.mongooseHealth.pingCheck('mongodb', {
            connection: this.mongoConnection,
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
