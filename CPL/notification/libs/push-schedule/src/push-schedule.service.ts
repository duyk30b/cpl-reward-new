import { currentTimestamp } from '@libs/util'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { LessThanOrEqual, Repository } from 'typeorm'
import { PushSchedule } from './push-schedule.entity'
import {
  EPushScheduleStatus,
  ICreatePushSchedule,
  IUpdatePushSchedule,
} from './push-schedule.variable'

@Injectable()
export class PushScheduleService {
  constructor(
    @InjectRepository(PushSchedule)
    private readonly pushScheduleRepository: Repository<PushSchedule>,
  ) {}

  async create(createDto: ICreatePushSchedule) {
    const record = new PushSchedule()
    record.groupNotificationId = createDto.groupNotificationId
    record.title = createDto.title
    record.content = createDto.content
    record.publishAt = createDto.publishAt || new Date().getTime()
    record.userGroups = createDto.userGroups || []
    record.status = EPushScheduleStatus.NEW
    return await this.pushScheduleRepository.save(record)
  }

  async update(id: string, updateDto: IUpdatePushSchedule) {
    await this.pushScheduleRepository.update(
      { id },
      {
        title: updateDto.title,
        content: updateDto.content,
        publishAt: updateDto.publishAt || new Date().getTime(),
        userGroups: updateDto.userGroups || [],
      },
    )
  }

  async startProcess(id: string) {
    await this.pushScheduleRepository.update(
      { id },
      {
        status: EPushScheduleStatus.PROCESSING,
      },
    )
  }

  async complete(id: string) {
    await this.pushScheduleRepository.update(
      { id },
      {
        status: EPushScheduleStatus.COMPLETED,
        sentAt: new Date().getTime(),
      },
    )
  }

  async deleteByGroupNotificationId(groupNotificationId: string) {
    await this.pushScheduleRepository.delete({ groupNotificationId })
  }

  async findByGroupNotificationId(groupNotificationId: string) {
    return await this.pushScheduleRepository.findOne({ groupNotificationId })
  }

  async getReadyToProcessItems() {
    return await this.pushScheduleRepository.find({
      status: EPushScheduleStatus.NEW,
      publishAt: LessThanOrEqual(currentTimestamp()),
    })
  }
}
