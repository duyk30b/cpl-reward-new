import { Expose } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator'
import { GrpcHotWalletBaseResponse } from '@lib/grpc-client/hot-wallet/dtos'

export class CreateBceManualDepositDto {
  @Expose({ name: 'currency' })
  @ApiProperty({
    name: 'currency',
    example: 'eth',
  })
  @IsNotEmpty()
  currency: string

  @Expose({ name: 'user_id' })
  @ApiProperty({
    name: 'user_id',
    example: '123',
  })
  @IsNotEmpty()
  userId: string

  @Expose({ name: 'tx_hash' })
  @ApiProperty({
    example: '0x3B3ee1931Dc30C1957379FAc9aba94D1C48a5405',
    name: 'tx_hash',
  })
  @IsNotEmpty()
  txHash: string

  @Expose({ name: 'to_address' })
  @ApiProperty({
    example: '0x3B3ee1931Dc30C1957379FAc9aba94D1C48a5405',
    name: 'to_address',
  })
  @IsNotEmpty()
  toAddress: string

  @Expose({ name: 'from_address' })
  @ApiProperty({
    example: '0x3B3ee1931Dc30C1957379FAc9aba94D1C48a5405',
    name: 'from_address',
  })
  @IsNotEmpty()
  fromAddress: string

  @Expose({ name: 'amount' })
  @ApiProperty({
    example: 123.23,
    name: 'amount',
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number

  @Expose({ name: 'destination_tag' })
  @ApiPropertyOptional({
    example: 21343,
    name: 'destination_tag',
  })
  @IsOptional()
  @IsNumber()
  destinationTag?: number

  @Expose({ name: 'date' })
  @ApiProperty({
    example: '2023-02-25 16:17:12',
    name: 'date',
  })
  @IsNotEmpty()
  date: string
}

export class GrpcCreateBceManualDepositResponse extends GrpcHotWalletBaseResponse<
  any,
  any
> {
  data: {
    result: boolean
  }
}
