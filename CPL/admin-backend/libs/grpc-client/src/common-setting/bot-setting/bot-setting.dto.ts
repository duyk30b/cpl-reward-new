import { Expose } from 'class-transformer'
import { IsNumber, IsString } from 'class-validator'

export class CheckBotByIdRequest {
  @Expose({ name: 'user_id' })
  @IsString()
  userId: string
}

export class CheckBotByIdResponse {
  @Expose({ name: 'is_bot', toPlainOnly: true })
  @IsNumber()
  isBot: number // 0: not bot, 1: bot
}
