import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToClass } from 'class-transformer'
import { Repository } from 'typeorm'
import { EmailCheckLog } from '../entities/email-check-log.entity'

export interface ICreateEmailCheckLog {
  email: string
  existedEmail: string
  ip: string
  deviceHash: string
}

@Injectable()
export class EmailCheckLogService {
  constructor(
    @InjectRepository(EmailCheckLog)
    private readonly emailCheckLogRepository: Repository<EmailCheckLog>,
  ) {}

  async create(log: ICreateEmailCheckLog) {
    return await this.emailCheckLogRepository.save(
      plainToClass(EmailCheckLog, log, { ignoreDecorators: true }),
    )
  }
}
