import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'
import { BasePaginationQuery, GrpcHotWalletBaseResponse } from './base.dto'
import { WalletDto } from './wallet.dto'

export enum INCIDENT_DOMAIN {
  ALL = 'ALL',
  USER = 'USER',
  MOTHER = 'MOTHER',
}

export class GrpcFilterIncidentCollectionQuery extends BasePaginationQuery {
  @Expose({
    name: 'chain_code',
  })
  chainCode: string

  @Expose()
  @ApiProperty({
    example: 'ALL or MOTHER or USER',
    description: 'List wallet type to withdraw',
  })
  domain: INCIDENT_DOMAIN

  @Expose({
    name: 'min_balance',
  })
  @ApiProperty({
    example: '1',
    description:
      'Minimum balance to withdraw, all wallet with balance above this setting will be valid for withdraw',
  })
  minBalance: string

  @Expose({
    name: 'max_balance',
  })
  @ApiProperty({
    example: '1',
    description:
      'Maximum balance to withdraw, all wallet with balance below this setting will be valid for withdraw',
  })
  maxBalance: string

  @Expose()
  @ApiProperty({
    example: 'eth, btc,...',
    description: 'Coin currency',
  })
  @IsNotEmpty()
  symbol: string
}

export class IncidentMetaDataResponse {
  @Expose({
    name: 'incidence_amount',
    toPlainOnly: true,
  })
  @ApiProperty({
    description: 'Summary of incident withdraw amount in user/mother domain',
    example: 270,
  })
  incidenceAmount: number
}

export class GrpcGetIncidentCollectionResponse extends GrpcHotWalletBaseResponse<
  WalletDto[],
  IncidentMetaDataResponse
> {
  @Expose()
  data: WalletDto[]

  @Expose()
  meta_data?: IncidentMetaDataResponse
}

export class EstimatedBalanceItem {
  @Expose()
  @ApiProperty({
    example: '15',
    description: 'Total wallet valid the conditions',
  })
  total: number

  @ApiProperty({
    example: '100',
    description: 'Total balance will be withdraw',
  })
  balance: string
}

export class EstimatedBalance {
  [coin: string]: EstimatedBalanceItem
}

export class IncidentDto {
  @ApiProperty({
    description: 'Total wallet valid the conditions',
  })
  total: number

  @Expose({
    name: 'estimated_balances',
    toPlainOnly: true,
  })
  @ApiProperty({
    description: 'Summary of all withdrawal currencies',
  })
  @Type(() => EstimatedBalance)
  estimatedBalances: EstimatedBalance
}

export class IncidentResponse {
  @Expose()
  @ApiProperty({
    description: 'Total wallet valid the conditions in both mother and user',
  })
  total: number

  @ApiProperty({
    description: 'Summary of incident withdraw in mother domain',
  })
  @Type(() => IncidentDto)
  mother: IncidentDto

  @ApiProperty({
    description: 'Summary of incident withdraw in user domain',
  })
  @Type(() => IncidentDto)
  user: IncidentDto
}

export class GrpcPostIncidentCollectionResponse extends GrpcHotWalletBaseResponse<
  IncidentResponse,
  IncidentMetaDataResponse
> {
  data: IncidentResponse
  meta_data?: IncidentMetaDataResponse
}
