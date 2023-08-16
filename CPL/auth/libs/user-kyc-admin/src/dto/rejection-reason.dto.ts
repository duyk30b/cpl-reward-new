import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class RejectionReasonDto {
  @ApiProperty({ name: 'reason_category_id' })
  @Expose({ name: 'reason_category_id' })
  @IsNotEmpty()
  reasonCategoryId: number

  @ApiProperty({ name: 'reason_category_name_en' })
  @Expose({ name: 'reason_category_name_en' })
  @IsNotEmpty()
  reasonCategoryNameEn: string

  @ApiProperty({ name: 'reason_category_name_ja' })
  @Expose({ name: 'reason_category_name_ja' })
  @IsNotEmpty()
  reasonCategoryNameJa: string

  @ApiProperty({ name: 'rejection_reason_id' })
  @Expose({ name: 'rejection_reason_id' })
  @IsNotEmpty()
  rejectionReasonId: number

  @ApiProperty({ name: 'rejection_reason_name_en' })
  @Expose({ name: 'rejection_reason_name_en' })
  @IsNotEmpty()
  rejectionReasonNameEn: string

  @ApiProperty({ name: 'rejection_reason_name_ja' })
  @Expose({ name: 'rejection_reason_name_ja' })
  @IsNotEmpty()
  rejectionReasonNameJa: string
}
