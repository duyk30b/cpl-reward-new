import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty, IsNumberString } from 'class-validator'

export class CreateRewardRuleDto {
  @ApiProperty({ type: String, required: true })
  @Expose()
  @IsNotEmpty()
  key: string

  @ApiProperty({ type: String, required: true })
  @Expose()
  @IsNotEmpty()
  currency: string

  @ApiProperty({ type: String, required: true })
  @Expose({ name: 'limit_value' })
  @IsNotEmpty()
  @IsNumberString()
  limitValue: string
}

export class UpdateRewardRuleDto extends CreateRewardRuleDto {
  @ApiProperty({ type: Number, required: true })
  @Expose()
  @IsNotEmpty()
  id: number
}
