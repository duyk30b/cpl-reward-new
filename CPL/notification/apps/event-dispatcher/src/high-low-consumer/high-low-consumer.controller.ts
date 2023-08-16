import { EHighLowEvent } from '@libs/common'
import { KafkaTopic, PayloadMessage } from '@libs/kafka'
import { Controller } from '@nestjs/common'
import { HighLowResultMessageDto } from './dto/high-low-result-message.dto'
import { HighLowConsumerService } from './high-low-consumer.service'

@Controller()
export class HighLowConsumerController {
  constructor(
    private readonly highLowConsumerService: HighLowConsumerService,
  ) {}

  @KafkaTopic(EHighLowEvent.WIN)
  async handleHighLowWin(@PayloadMessage() message: HighLowResultMessageDto) {
    await this.highLowConsumerService.handleHighLowResult(message, 'Win')
  }

  @KafkaTopic(EHighLowEvent.LOSE)
  async handleHighLowLose(@PayloadMessage() message: HighLowResultMessageDto) {
    await this.highLowConsumerService.handleHighLowResult(message, 'Lose')
  }
}
