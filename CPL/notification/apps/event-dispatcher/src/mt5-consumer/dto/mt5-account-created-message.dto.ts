import { KafkaMessageDto } from '@libs/kafka'
import { Expose, Type } from 'class-transformer'
import { IsNotEmpty, ValidateNested } from 'class-validator'

export class Mt5AccountCreatedMessageDataDto {
  @Expose({ name: 'user_id' })
  @IsNotEmpty()
  userId: string

  @Expose()
  @IsNotEmpty()
  login: string

  @Expose()
  @IsNotEmpty()
  password: string

  @Expose()
  @IsNotEmpty()
  server: string

  @Expose({ name: 'mt5_terminal_url' })
  @IsNotEmpty()
  mt5TerminalUrl: string

  @Expose({ name: 'web_trader_url' })
  @IsNotEmpty()
  webTraderUrl: string

  @Expose({ name: 'deposit_url' })
  @IsNotEmpty()
  depositUrl: string

  @Expose({ name: 'account_type' })
  accountType: string

  @Expose()
  balance: string
}

export class Mt5AccountCreatedMessageDto extends KafkaMessageDto {
  @Expose()
  @ValidateNested()
  @Type(() => Mt5AccountCreatedMessageDataDto)
  data: Mt5AccountCreatedMessageDataDto
}
