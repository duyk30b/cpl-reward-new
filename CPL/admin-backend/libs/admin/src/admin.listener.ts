import {
  MailTemplate,
  NotificationService,
} from '@lib/grpc-client/notification'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { OnEvent } from '@nestjs/event-emitter'
import { AdminCreatedEvent, AdminEvent } from './admin.event'

@Injectable()
export class AdminListener {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly configService: ConfigService,
  ) {}

  @OnEvent(AdminEvent.CREATED)
  async handleAdminCreatedEvent(event: AdminCreatedEvent) {
    await this.notificationService.sendMail({
      emails: [event.email],
      data: JSON.stringify({
        ...event,
        adminFrontendUrl: this.configService.get(
          'global.admin_v3_frontend_url',
        ),
      }),
      mailCommand: {
        lang: 'en',
        template: MailTemplate.ADMIN_CREATED,
      },
    })
  }
}
