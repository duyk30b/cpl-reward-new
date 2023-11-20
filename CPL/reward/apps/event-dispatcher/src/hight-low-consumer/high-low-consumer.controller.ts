import { KafkaTopic, KAFKA_EVENTS, MessageId } from '@lib/kafka'
import { Controller } from '@nestjs/common'
import { Payload } from '@nestjs/microservices'
import { HighLowCancelDto } from './dto/high-low-cancel'
import { HighLowCreateDto } from './dto/high-low-create.dto'
import { HighLowLoseDto } from './dto/high-low-lose.dto'
import { HighLowTransferBalanceDto } from './dto/high-low-transfer-balance'
import { HighLowWinDto } from './dto/high-low-win.dto'
import { HighLowConsumerService } from './high-low-consumer.service'

@Controller()
export class HighLowConsumerController {
  constructor(private readonly highLowConsumerService: HighLowConsumerService) {}

  // @KafkaTopic(KAFKA_EVENTS.HIGH_LOW_CANCEL)
  // async handleHighLowCancel(
  //   @Payload('value') message: HighLowCancelDto,
  //   @MessageId() messageId: string,
  // ) {
  //   await this.highLowConsumerService.handleHighLowMessageResult({
  //     userId: message.userId,
  //     messageId,
  //     eventName: KAFKA_EVENTS.HIGH_LOW_CANCEL,
  //     data: message,
  //     createTime: message.createdAtUnix,
  //   })
  // }

  @KafkaTopic(KAFKA_EVENTS.HIGH_LOW_CREATE)
  async handleHighLowCreate(
    @Payload('value') message: HighLowCreateDto,
    @MessageId() messageId: string,
  ) {
    await this.highLowConsumerService.handleHighLowMessageResult({
      userId: message.userId,
      messageId,
      eventName: KAFKA_EVENTS.HIGH_LOW_CREATE,
      data: message,
      createTime: message.createdAtUnix,
    })
  }

  @KafkaTopic(KAFKA_EVENTS.HIGH_LOW_LOSE)
  async handleHighLowLose(
    @Payload('value') message: HighLowLoseDto,
    @MessageId() messageId: string,
  ) {
    await this.highLowConsumerService.handleHighLowMessageResult({
      userId: message.userId,
      messageId,
      eventName: KAFKA_EVENTS.HIGH_LOW_LOSE,
      data: message,
      createTime: message.createdAtUnix,
    })
  }

  @KafkaTopic(KAFKA_EVENTS.HIGH_LOW_TRANSFER_BALANCE)
  async handleHighLowTransferBalance(
    @Payload('value') message: HighLowTransferBalanceDto,
    @MessageId() messageId: string,
  ) {
    await this.highLowConsumerService.handleHighLowMessageResult({
      userId: message.userId,
      messageId,
      eventName: KAFKA_EVENTS.HIGH_LOW_TRANSFER_BALANCE,
      data: message,
      createTime: Math.ceil(Date.now() / 1000),
    })
  }

  @KafkaTopic(KAFKA_EVENTS.HIGH_LOW_WIN)
  async handleHighLowWin(@Payload('value') message: HighLowWinDto, @MessageId() messageId: string) {
    await this.highLowConsumerService.handleHighLowMessageResult({
      userId: message.userId,
      messageId,
      eventName: KAFKA_EVENTS.HIGH_LOW_WIN,
      data: message,
      createTime: message.createdAtUnix,
    })
  }
}
