import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
import { INotificationCategoryService } from './notification-category.interface'

@Injectable()
export class NotificationCategoryService {
  private service: INotificationCategoryService
  constructor(
    @Inject('NOTIFICATION_CATEGORY_PACKAGE') private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.service = this.client.getService<INotificationCategoryService>(
      'NotificationCategoryService',
    )
  }

  async getList() {
    const req = this.service.getList({})
    const data = await lastValueFrom(req)
    return data
  }
}
