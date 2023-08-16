import { IPostResponse } from '@libs/grpc-client'
import {
  ICreateGroupNotificationDto,
  IGroupNotificationFilter,
  IUpdateGroupNotificationDto,
} from '@libs/notification'
import { IDataById } from '@libs/util'
import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { ISendMailRequest } from './grpc-notification.interface'
import { GrpcNotificationService } from './grpc-notification.service'

@Controller('Notification')
export class GrpcNotificationController {
  constructor(
    private readonly grpcNotificationService: GrpcNotificationService,
  ) {}

  @GrpcMethod('NotificationService')
  async getListGroupNotification(
    groupNotificationFilter: IGroupNotificationFilter,
  ) {
    return await this.grpcNotificationService.getListGroupNotification(
      groupNotificationFilter,
    )
  }

  @GrpcMethod('NotificationService')
  async findGroupNotificationById(dataById: IDataById) {
    return await this.grpcNotificationService.findGroupNotificationById(
      dataById.id,
    )
  }

  @GrpcMethod('NotificationService')
  async createGroupNotification(
    createGroupNotificationDto: ICreateGroupNotificationDto,
  ) {
    return await this.grpcNotificationService.createGroupNotification(
      createGroupNotificationDto,
    )
  }

  @GrpcMethod('NotificationService')
  async updateGroupNotification(
    updateGroupNotificationDto: IUpdateGroupNotificationDto,
  ) {
    return await this.grpcNotificationService.updateGroupNotification(
      updateGroupNotificationDto,
    )
  }

  @GrpcMethod('NotificationService')
  async sendMail(sendMailRequest: ISendMailRequest): Promise<IPostResponse> {
    return await this.grpcNotificationService.sendMail(sendMailRequest)
  }

  @GrpcMethod('NotificationService')
  async getSupportedLangs() {
    return await this.grpcNotificationService.getSupportedLangs()
  }
}
