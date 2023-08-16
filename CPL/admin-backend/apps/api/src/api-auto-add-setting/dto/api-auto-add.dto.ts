import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { Expose } from 'class-transformer'
import { EValidationError, TransformTrim } from '@lib/util'

export class GetSmartContractDto {
  @ApiProperty()
  @IsNotEmpty({
    message: EValidationError.REQUIRED,
  })
  @Expose()
  @TransformTrim()
  address: string

  @ApiProperty({ name: 'chain_code' })
  @IsNotEmpty({ message: EValidationError.REQUIRED })
  @Expose({ name: 'chain_code' })
  @TransformTrim()
  chainCode: string
}

export class ValidCurrencyDto {
  @ApiProperty({ name: 'contract_address' })
  @Expose({ name: 'contract_address' })
  @TransformTrim()
  contractAddress: string

  @ApiProperty({ name: 'coin' })
  @Expose({ name: 'coin' })
  @TransformTrim()
  coin: string

  @ApiProperty({ name: 'coin_name' })
  @Expose({ name: 'coin_name' })
  @TransformTrim()
  coinName: string

  @ApiProperty({ name: 'coin_edit' })
  @Expose({ name: 'coin_edit' })
  @TransformTrim()
  coinEdit: string
}
