import { MultiLanguageFieldDto } from '@libs/common'
import { GroupNotification } from '@libs/notification'
import { TransformInt } from '@libs/util'
import { Injectable, Logger } from '@nestjs/common'
import {
  Expose,
  instanceToPlain,
  plainToInstance,
  Type,
} from 'class-transformer'

class GroupNotificationForSocketDto {
  @Expose()
  id: string

  @Expose()
  image: string

  @Expose({ name: 'is_read' })
  isRead = false

  @Expose()
  @Type(() => MultiLanguageFieldDto)
  title: MultiLanguageFieldDto

  @Expose({ name: 'publish_at' })
  @TransformInt()
  publishAt: number
}

@Injectable()
export class WorkerGroupNotificationService {
  private readonly logger = new Logger(WorkerGroupNotificationService.name)

  async handleGroupNotificationPublish(notification: GroupNotification) {
    this.logger.log(`Handle publish notification: ${notification.id}`)
    // if (notification.isGlobal) {
    //   const websocketData = plainToInstance(
    //     GroupNotificationForSocketDto,
    //     notification,
    //     {
    //       ignoreDecorators: true,
    //       excludeExtraneousValues: true,
    //       exposeDefaultValues: true,
    //     },
    //   )

    //   await this.websocketService.publish(
    //     'global',
    //     instanceToPlain(websocketData),
    //   )
    // } else {
    // }
  }
}
