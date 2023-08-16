import { currentTimestamp, timeWithFormat } from '@libs/util'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectConnection } from '@nestjs/mongoose'
import { plainToInstance } from 'class-transformer'
import { Connection } from 'mongoose'
import { ICreatePushLog } from '../interfaces/push-log.interface'
import { PushLog } from '../schemas/push-log.schema'

@Injectable()
export class PushLogService {
  private readonly timePartitionFormat = 'YYYY_MM'

  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    private readonly configService: ConfigService,
  ) {
    this.timePartitionFormat = this.configService.get(
      'noti_log.time_partition_format',
    )
  }

  async saveLog(saveLogDto: ICreatePushLog) {
    const log = plainToInstance(PushLog, saveLogDto, {
      excludeExtraneousValues: true,
    })
    log.createdAt = currentTimestamp()

    const collectionName = `push_log_${timeWithFormat(
      log.createdAt,
      this.timePartitionFormat,
    )}`
    await this.connection.collection(collectionName).insertOne(log)
  }
}
