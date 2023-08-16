import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator'

export class CancelOrderRequestDto {
  @ApiProperty({ name: 'order_ids', example: ['112321', '123212', '312321'] })
  @Expose({ name: 'order_ids' })
  @IsArray()
  @ArrayMinSize(1)
  orderIds: string[]

  @Expose({ name: 'canceller_id' })
  @IsNumberString()
  @IsOptional()
  cancellerId?: string
}

export class CancelOrderByUserIdRequestDto {
  @ApiProperty({ name: 'user_id' })
  @Expose({ name: 'user_id' })
  @IsString()
  userId: string

  @Expose({ name: 'canceller_id' })
  @IsNumberString()
  @IsOptional()
  cancellerId?: string
}

export class CancelOrderByIdsResponseDto {
  @Expose({ name: 'status_code', toPlainOnly: true })
  @ApiProperty({ name: 'status_code' })
  @IsNumber()
  @IsNotEmpty()
  statusCode: number

  @Expose()
  @ApiProperty({ name: 'message' })
  @IsString()
  @IsNotEmpty()
  message: string
}
