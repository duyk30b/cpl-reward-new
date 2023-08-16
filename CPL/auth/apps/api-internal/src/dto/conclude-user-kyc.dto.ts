import { ApiProperty } from '@nestjs/swagger'
import { getEnumComment, getEnumValues } from '@lib/util'
import { RejectionReasonDto } from '@lib/user-kyc-admin/dto/rejection-reason.dto'
import { KycStatus, RiskRating } from '@lib/user-kyc/enum/user-kyc.enum'
import { Expose, Type } from 'class-transformer'
import { IsEnum, IsNotEmpty, ValidateIf, ValidateNested } from 'class-validator'

export class ConcludeUserKycDto {
  @ApiProperty({ name: 'user_id' })
  @Expose({ name: 'user_id' })
  @IsNotEmpty()
  userId: string

  @ApiProperty({
    enum: [KycStatus.REJECT, KycStatus.PENDING, KycStatus.ACCEPT],
    description: '2 - REJECT, 3 - PENDING, 1 - ACCEPT',
  })
  @Expose()
  @IsNotEmpty()
  @IsEnum([KycStatus.REJECT, KycStatus.PENDING, KycStatus.ACCEPT])
  status: number

  @ApiProperty({
    name: 'risk_rating',
    enum: getEnumValues(RiskRating),
    description: getEnumComment(RiskRating),
  })
  @Expose({ name: 'risk_rating' })
  @IsNotEmpty()
  @IsEnum(getEnumValues(RiskRating))
  riskRating: number

  @ApiProperty({
    name: 'rejection_reasons',
    type: [RejectionReasonDto],
    required: false,
  })
  @Expose({ name: 'rejection_reasons' })
  @ValidateNested({ each: true })
  @Type(() => RejectionReasonDto)
  @ValidateIf((o) => o.status == KycStatus.REJECT)
  @IsNotEmpty()
  rejectionReasons: RejectionReasonDto[]
}
