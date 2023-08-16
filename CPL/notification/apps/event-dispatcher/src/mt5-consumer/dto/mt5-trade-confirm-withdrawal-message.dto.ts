import { KafkaMessageDto } from '@libs/kafka'
import { Expose, Type } from 'class-transformer'
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator'

export class Mt5TradeConfirmWithdrawalMessageDataDto {
  @Expose({ name: 'admin_email' })
  @IsNotEmpty()
  @IsArray()
  adminEmail: string[]

  @Expose()
  @IsNotEmpty()
  login: string

  @Expose({ name: 'beneficiary_bank' })
  @IsNotEmpty()
  beneficiaryBank: string

  @Expose({ name: 'account_number' })
  @IsNotEmpty()
  accountNumber: string

  @Expose({ name: 'account_holder_name' })
  @IsNotEmpty()
  accountHolderName: string

  @Expose({ name: 'user_phone_number' })
  @IsNotEmpty()
  userPhoneNumber: string

  @Expose({ name: 'withdrawal_amount' })
  @IsNotEmpty()
  withdrawalAmount: string

  @Expose()
  @IsNotEmpty()
  fee: string

  @Expose({ name: 'amount_receivable' })
  @IsNotEmpty()
  amountReceivable: string
}

export class Mt5TradeConfirmWithdrawalMessageDto extends KafkaMessageDto {
  @Expose()
  @ValidateNested()
  @Type(() => Mt5TradeConfirmWithdrawalMessageDataDto)
  data: Mt5TradeConfirmWithdrawalMessageDataDto
}
