import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
import {
  INotificationService,
  ISendMailRequest,
} from './notification.service.interface'

@Injectable()
export class NotificationService {
  private notificationService: INotificationService
  constructor(@Inject('NOTIFICATION_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.notificationService = this.client.getService<INotificationService>(
      'NotificationService',
    )
  }

  async sendMail(sendMailRequest: ISendMailRequest) {
    const req = this.notificationService.sendMail(sendMailRequest)
    return await lastValueFrom(req)
  }
}
