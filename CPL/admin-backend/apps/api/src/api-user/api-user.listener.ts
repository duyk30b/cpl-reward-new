import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { BanUserCreatedEvent, BanUserEvent } from './api-user.event'
import { UploadFileService } from '@lib/upload-file'
import { UserService } from '@lib/grpc-client/user'
import { BanUserHistoryService, STATUS } from '@lib/ban-user-history'
import { QUEUE_BAN_USER, QueueService } from '@lib/queue'
import { getClientIp } from 'request-ip'

@Injectable()
export class ApiUserListener {
  constructor(
    private readonly uploadFileService: UploadFileService,
    private readonly userService: UserService,
    private readonly banUserHistoryService: BanUserHistoryService,
    private readonly queueService: QueueService,
  ) {}

  @OnEvent(BanUserEvent.CREATED)
  async handleCreateBanUsersEvent(event: BanUserCreatedEvent) {
    const content = (await this.uploadFileService.readObjectData(
      event.key,
    )) as string

    const rows = content.slice(0).split('\n')
    if (rows.length === 0) return

    for (const row of rows) {
      const values = row.replace(/\r/g, '').split(',')
      if (values.length === 0 || values[0] === '') continue
      const userId = values[0]

      const user = await this.userService.findById(userId)

      const getStatusNote = this.userService.getStatusBanUserHistory(user)
      const createBanUserHistory = {
        userId,
        email: user.email,
        adminId: event.adminId,
        adminActionId: event.adminActionId,
        requestTime: event.requestTime,
        status: getStatusNote.status,
        note: getStatusNote.note,
      }
      const banUserHistory = await this.banUserHistoryService.create(
        createBanUserHistory,
      )

      if (createBanUserHistory.status !== STATUS.WAITING) continue

      const bannedUserHistory = {
        ...createBanUserHistory,
        id: banUserHistory.id,
        status: STATUS.PROCESSING,
      }
      await this.banUserHistoryService.update(bannedUserHistory)

      const ip = getClientIp(event.request)
      await this.queueService.addUserJob(
        QUEUE_BAN_USER,
        {
          banUserHistoryId: banUserHistory.id,
          userId,
          adminId: event.request.accessTokenInfo
            ? event.request.accessTokenInfo.uid
            : '0',
          ip,
          userAgent: event.request.headers['user-agent'],
        },
        {
          removeOnComplete: true,
          attempts: 1,
        },
      )
    }
  }
}
