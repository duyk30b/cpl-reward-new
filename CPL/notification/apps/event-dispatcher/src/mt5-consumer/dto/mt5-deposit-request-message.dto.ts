import { KafkaMessageDto } from '@libs/kafka'
import { Expose, Type } from 'class-transformer'
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator'

export class Mt5DepositRequestMessageDataDto {
  @Expose({ name: 'admin_email' })
  @IsNotEmpty()
  @IsArray()
  adminEmail: string[]

  @Expose()
  @IsNotEmpty()
  login: string

  @Expose({ name: 'name' })
  @IsNotEmpty()
  name: string

  @Expose({ name: 'company_name' })
  companyName: string

  @Expose({ name: 'companyAddress' })
  companyAddress: string

  @Expose({ name: 'bank_account' })
  bankAccount: string

  @Expose({ name: 'bank_address' })
  bankAddress: string

  @Expose({ name: 'bank_name' })
  bankName: string

  @Expose()
  @IsNotEmpty()
  amount: string

  @Expose({ name: 'total_amount' })
  @IsNotEmpty()
  totalAmount: string

  @Expose({ name: 'exchange_rate' })
  @IsNotEmpty()
  exchangeRate: string

  @Expose({ name: 'base_currency' })
  @IsNotEmpty()
  baseCurrency: string

  @Expose({ name: 'quote_currency' })
  @IsNotEmpty()
  quoteCurrency: string
}

export class Mt5DepositRequestMessageDto extends KafkaMessageDto {
  @Expose()
  @ValidateNested()
  @Type(() => Mt5DepositRequestMessageDataDto)
  data: Mt5DepositRequestMessageDataDto
}
