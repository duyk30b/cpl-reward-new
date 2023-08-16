import { KafkaMessageDto } from '@lib/kafka'
import { Expose, Type } from 'class-transformer'
import { IsDefined, IsNumber, IsString, ValidateNested } from 'class-validator'

export class UserKycRegisteredData {
  @Expose({ name: 'user_id' })
  @IsDefined()
  @Type(() => String)
  userId: string

  // @Expose()
  // @IsString()
  // id: string

  @Expose()
  @IsNumber()
  type: number

  @Expose({ name: 'id_document_type' })
  @IsNumber()
  idDocumentType: number

  @Expose({ name: 'country_id' })
  @IsNumber()
  countryId: number
}

export class UserKycRegisteredDto extends KafkaMessageDto {
  @Expose()
  @ValidateNested()
  @Type(() => UserKycRegisteredData)
  data: UserKycRegisteredData
}

// Example:
// {
//   "data": {
//     "created_at": 1673924744558,
//     "updated_at": 1673924744558,
//     "id": "2400",
//     "user_id": "67692",
//     "user_kyc_history_id": "3267",
//     "id_document_type": 2,
//     "status": 5,
//     "type": 2,
//     "image_provider": 2,
//     "risk_scan_provider": 1,
//     "id_document_no": "",
//     "compare_document_type": 0,
//     "compare_liveness_selfie": 0,
//     "compare_birthday": 0,
//     "compare_name": 0,
//     "rejection_reasons": [],
//     "country_id": 1006,
//     "image_providers": [
//       2
//     ],
//     "risk_scan_providers": []
//   },
//   "create_time": 1673924754607,
//   "version": 1
// }
