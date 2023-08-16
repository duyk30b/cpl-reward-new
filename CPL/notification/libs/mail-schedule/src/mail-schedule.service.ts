import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MailSchedule } from './mail-schedule.entity'
import {
  EMailScheduleStatus,
  ICreateMailSchedule,
  IUpdateMailSchedule,
} from './mail-schedule.variable'

@Injectable()
export class MailScheduleService {
  constructor(
    @InjectRepository(MailSchedule)
    private readonly mailScheduleRepository: Repository<MailSchedule>,
  ) {}

  async create(createDto: ICreateMailSchedule) {
    const record = new MailSchedule()
    record.groupNotificationId = createDto.groupNotificationId
    record.title = createDto.title
    record.content = createDto.content
    record.publishAt = createDto.publishAt || new Date().getTime()
    record.userGroups = createDto.userGroups || []
    record.status = EMailScheduleStatus.NEW
    return await this.mailScheduleRepository.save(record)
  }

  async update(id: string, updateDto: IUpdateMailSchedule) {
    await this.mailScheduleRepository.update(
      { id },
      {
        title: updateDto.title,
        content: updateDto.content,
        publishAt: updateDto.publishAt || new Date().getTime(),
        userGroups: updateDto.userGroups || [],
      },
    )
  }

  async startProcess(id) {
    await this.mailScheduleRepository.update(
      { id },
      {
        status: EMailScheduleStatus.PROCESSING,
      },
    )
  }

  async complete(id: string) {
    await this.mailScheduleRepository.update(
      { id },
      {
        status: EMailScheduleStatus.COMPLETED,
        sentAt: new Date().getTime(),
      },
    )
  }

  async deleteByGroupNotificationId(groupNotificationId: string) {
    await this.mailScheduleRepository.delete({ groupNotificationId })
  }

  async findByGroupNotificationId(groupNotificationId: string) {
    return await this.mailScheduleRepository.findOne({ groupNotificationId })
  }
}
