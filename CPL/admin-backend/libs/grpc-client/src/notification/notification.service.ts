import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { plainToInstance } from 'class-transformer'
import { lastValueFrom } from 'rxjs'
import { GroupNotificationDto } from './notification.dto'
import {
  ICreateGroupNotification,
  IGroupNotificationFilter,
  INotificationService,
  ISendMailRequest,
  IUpdateGroupNotification,
} from './notification.interface'

@Injectable()
export class NotificationService {
  private service: INotificationService
  constructor(@Inject('NOTIFICATION_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.service = this.client.getService<INotificationService>(
      'NotificationService',
    )
  }

  async sendMail(sendMailRequest: ISendMailRequest) {
    const req = this.service.sendMail(sendMailRequest)
    return await lastValueFrom(req)
  }

  async getListGroupNotification(filter: IGroupNotificationFilter) {
    const req = this.service.getListGroupNotification(filter)
    const data = await lastValueFrom(req)
    data.data = (data.data || []).map((item) =>
      plainToInstance(GroupNotificationDto, item, {
        ignoreDecorators: true,
      }),
    )
    return data
  }

  async findGroupNotificationById(id: string) {
    const req = this.service.findGroupNotificationById({ id })
    const result = await lastValueFrom(req)
    return result.data
      ? plainToInstance(GroupNotificationDto, result.data, {
          ignoreDecorators: true,
        })
      : null
  }

  async createGroupNotification(dto: ICreateGroupNotification) {
    const req = this.service.createGroupNotification(dto)
    return await lastValueFrom(req)
  }

  async updateGroupNotification(dto: IUpdateGroupNotification) {
    const req = this.service.updateGroupNotification(dto)
    return await lastValueFrom(req)
  }

  async getSupportedLangs() {
    const req = this.service.getSupportedLangs({})
    const result = await lastValueFrom(req)
    return result.data
  }
}
