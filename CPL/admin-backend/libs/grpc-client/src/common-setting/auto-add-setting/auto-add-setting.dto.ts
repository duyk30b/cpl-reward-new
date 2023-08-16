import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose, Transform, Type } from 'class-transformer'
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { IsFixedNumberString } from '@app/common/validation/decorators/is-fixed-number-string'
import {
  BasePaginationDto,
  BasePaginationQueryDto,
} from '@app/common/base-pagination.dto'
import { GrpcCoinNetworkDto } from '@lib/grpc-client/exchange-setting/dtos/coin'
import { BaseCoinSettingItemDto } from '@lib/grpc-client/exchange-setting/dtos/coin/base-coin.dto'

class CreateBceCurrencySettingDto {
  @ApiProperty({ name: 'on_deposit' })
  @Type(() => Boolean)
  @IsBoolean()
  @Expose({ name: 'on_deposit' })
  onDeposit: boolean

  @ApiProperty({ name: 'on_withdrawal' })
  @Type(() => Boolean)
  @IsBoolean()
  @IsNotEmpty()
  @Expose({ name: 'on_withdrawal' })
  onWithdrawal: boolean

  @ApiProperty({ name: 'minimum_withdrawal' })
  @Type(() => String)
  @IsFixedNumberString({ message: 'minimumWithdrawal must be a fixed number' })
  @Expose({ name: 'minimum_withdrawal' })
  minimumWithdrawal: string

  @ApiProperty({ name: 'fee' })
  @Type(() => String)
  @IsFixedNumberString({ message: 'fee must be a fixed number' })
  @Expose({ name: 'fee' })
  fee: string

  @ApiProperty({ name: 'withdrawal_limit' })
  @Type(() => String)
  @IsFixedNumberString({ message: 'withdrawalLimit must be a fixed number' })
  @Expose({ name: 'withdrawal_limit' })
  withdrawalLimit: string

  @ApiProperty({ name: 'time_reset' })
  @Type(() => Number)
  @IsNumber()
  @Expose({ name: 'time_reset' })
  timeReset: string

  @ApiProperty({ name: 'withdrawal_threshold' })
  @Type(() => String)
  @IsFixedNumberString({
    message: 'withdrawalThreshold must be a fixed number',
  })
  @Expose({ name: 'withdrawal_threshold' })
  withdrawalThreshold: string

  @ApiProperty({ name: 'price' })
  @Type(() => String)
  @IsFixedNumberString({ message: 'price must be a fixed number' })
  @Expose({ name: 'price' })
  price: string
}

export class CreateCurrencySettingDto extends CreateBceCurrencySettingDto {
  @ApiProperty({ name: 'coin' })
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'coin' })
  @Transform(({ value }) => value && value.toLowerCase())
  coin: string

  @ApiProperty({ name: 'coin_name' })
  @Type(() => String)
  @IsString()
  @Expose({ name: 'coin_name' })
  coinName: string

  @ApiProperty({ name: 'icon' })
  @Type(() => String)
  @IsString()
  @Expose({ name: 'icon' })
  icon: string

  @ApiProperty({ name: 'contract_address' })
  @Type(() => String)
  @IsString()
  @Expose({ name: 'contract_address' })
  contractAddress: string

  @ApiProperty({ name: 'env' })
  @Type(() => String)
  @IsString()
  @Expose({ name: 'env' })
  env: string

  @ApiProperty({ name: 'decimals' })
  @Type(() => String)
  @IsFixedNumberString({ message: 'decimals must be a fixed number' })
  @Expose({ name: 'decimals' })
  decimals: string

  @ApiProperty({ name: 'required_confirmations' })
  @Type(() => Number)
  @IsNumber()
  @Expose({ name: 'required_confirmations' })
  requiredConfirmations: number

  @ApiProperty({ name: 'transaction_explorer' })
  @Type(() => String)
  @IsString()
  @Expose({ name: 'transaction_explorer' })
  transactionExplorer: string

  @ApiProperty({ name: 'transaction_path' })
  @Type(() => String)
  @IsString()
  @Expose({ name: 'transaction_path' })
  transactionPath: string

  @ApiProperty({ name: 'type' })
  @Type(() => String)
  @IsString()
  @Expose({ name: 'type' })
  type: string
}

export class UpdateCurrencySettingDto {
  @ApiProperty({ name: 'coin' })
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'coin' })
  coin: string

  @ApiProperty({ name: 'coin_name' })
  @Type(() => String)
  @IsString()
  @Expose({ name: 'coin_name' })
  coinName: string

  @ApiProperty({ name: 'env' })
  @Type(() => String)
  @IsString()
  @Expose({ name: 'env' })
  env: string
}

export class UpdateStatusDepositWithdrawDto {
  @ApiProperty({ name: 'coin' })
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'coin' })
  coin: string

  @ApiProperty({ name: 'type' })
  @Type(() => String)
  @IsString()
  @Expose({ name: 'type' })
  type: string

  @ApiProperty({ name: 'status' })
  @Type(() => Number)
  @IsNumber()
  @Expose({ name: 'status' })
  status: number
}

export class ISetCurrencySetting {
  @IsString()
  coin: string

  @IsString()
  name: string

  @IsString()
  contractAddress: string

  @IsString()
  icon: string

  @IsString()
  env: string

  @IsFixedNumberString()
  decimal: string

  @IsInt()
  confirmations: number

  @IsString()
  transactionExplorer: string

  @IsString()
  transactionTxPath: string

  @IsString()
  type: string

  @IsString()
  withdrawalThreshold: string

  @IsBoolean()
  onDeposit: boolean

  @IsBoolean()
  onWithdrawal: boolean
}

export class IUpdateCurrencySetting {
  @IsString()
  coin: string

  @IsString()
  name: string
}

export class IUpdateStatusDepositWithdraw {
  @IsString()
  coin: string

  @IsString()
  type: string

  @IsNumber()
  status: number
}

export class ResponseUploadIconDto {
  @ApiProperty({ name: 'url' })
  @Type(() => String)
  @IsString()
  @Expose({ name: 'url' })
  url: string
}

export class GetCurrencySettingDto extends BasePaginationQueryDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Expose()
  coin?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Expose()
  network?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Expose()
  sort?: string
}

export class GrpcCurrencySettingDto extends BaseCoinSettingItemDto {
  @ApiProperty({ type: [GrpcCoinNetworkDto] })
  @Type(() => GrpcCoinNetworkDto)
  networks: GrpcCoinNetworkDto[]

  @ApiProperty({ name: 'on_deposit', type: Boolean })
  @Expose({ name: 'on_deposit' })
  onDeposit: boolean

  @ApiProperty({ name: 'on_withdrawal', type: Boolean })
  @Expose({ name: 'on_withdrawal' })
  onWithdrawal: boolean
}

export class GrpcCurrencySettingResponse extends BasePaginationDto<
  GrpcCurrencySettingDto[]
> {
  @ApiProperty({ name: 'data', type: [GrpcCurrencySettingDto] })
  @Type(() => GrpcCurrencySettingDto)
  @ValidateNested({ each: true })
  @Expose({ name: 'data' })
  data: GrpcCurrencySettingDto[] = []
}

export class ChangeStatusDepositWithdrawResponse {
  @Expose()
  @ApiProperty({ type: Boolean })
  result: boolean
}
