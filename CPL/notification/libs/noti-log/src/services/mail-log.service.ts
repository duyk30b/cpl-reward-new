import { currentTimestamp, timeWithFormat } from '@libs/util'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectConnection } from '@nestjs/mongoose'
import { plainToInstance } from 'class-transformer'
import { Connection } from 'mongoose'
import { ICreateMailLog } from '../interfaces/mail-log.interface'
import { MailLog } from '../schemas/mail-log.schema'

@Injectable()
export class MailLogService {
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

  async saveLog(saveLogDto: ICreateMailLog) {
    const log = plainToInstance(MailLog, saveLogDto, {
      excludeExtraneousValues: true,
    })
    log.createdAt = currentTimestamp()

    const collectionName = `mail_log_${timeWithFormat(
      log.createdAt,
      this.timePartitionFormat,
    )}`
    await this.connection.collection(collectionName).insertOne(log)
  }
}
