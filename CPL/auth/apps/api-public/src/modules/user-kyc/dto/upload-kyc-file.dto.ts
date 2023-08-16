import { FileType, getEnumValues, IsFileType, MaxFileSize } from '@lib/util'
import { AuthValidationError } from '@lib/util'
import { Expose } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator'
import { KycIdDocumentMetadata } from '@lib/user-kyc/enum/user-kyc.enum'
import { ApiProperty } from '@nestjs/swagger'

export class UploadKycFileBodyDto {
  @ApiProperty()
  @IsOptional()
  @Expose()
  recaptcha: string

  @ApiProperty({
    enum: getEnumValues(KycIdDocumentMetadata),
  })
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @IsEnum(getEnumValues(KycIdDocumentMetadata), {
    message: AuthValidationError.IS_ENUM,
  })
  @Expose()
  metadata: KycIdDocumentMetadata

  @ApiProperty({ format: 'binary' })
  @Expose()
  file: string

  @ApiProperty({ name: 'face_recognition', required: false })
  @IsOptional()
  @Expose({ name: 'face_recognition' })
  faceRecognition: number
}

export class IdCardFrontFileDto {
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @IsFileType([FileType.JPG, FileType.PNG])
  @MaxFileSize(5120)
  @Expose()
  file: Express.Multer.File
}

export class IdCardBackFileDto {
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @IsFileType([FileType.JPG, FileType.PNG])
  @MaxFileSize(5120)
  @Expose()
  file: Express.Multer.File
}

export class PassportFileDto {
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @IsFileType([FileType.JPG, FileType.PNG])
  @MaxFileSize(5120)
  @Expose()
  file: Express.Multer.File
}

export class DrivingLicenceFrontFileDto {
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @IsFileType([FileType.JPG, FileType.PNG])
  @MaxFileSize(5120)
  @Expose()
  file: Express.Multer.File
}

export class DrivingLicenceBackFileDto {
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @IsFileType([FileType.JPG, FileType.PNG])
  @MaxFileSize(5120)
  @Expose()
  file: Express.Multer.File
}

export class NumberCardFrontFileDto {
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @IsFileType([FileType.JPG, FileType.PNG])
  @MaxFileSize(5120)
  @Expose()
  file: Express.Multer.File
}

export class NumberCardBackFileDto {
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @IsFileType([FileType.JPG, FileType.PNG])
  @MaxFileSize(5120)
  @Expose()
  file: Express.Multer.File
}

export class ResidenceCardFrontFileDto {
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @IsFileType([FileType.JPG, FileType.PNG])
  @MaxFileSize(5120)
  @Expose()
  file: Express.Multer.File
}

export class ResidenceCardBackFileDto {
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @IsFileType([FileType.JPG, FileType.PNG])
  @MaxFileSize(5120)
  @Expose()
  file: Express.Multer.File
}

export class SelfieFileDto {
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @IsFileType([FileType.JPG, FileType.PNG])
  @MaxFileSize(5120)
  @Expose()
  file: Express.Multer.File
}

export class FaceRecognitionFileDto {
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @IsFileType([FileType.JPG, FileType.PNG])
  @MaxFileSize(5120)
  @Expose()
  file: Express.Multer.File
}

export class AdditionDocumentFileDto {
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @IsFileType([FileType.JPG, FileType.PNG, FileType.PDF])
  @MaxFileSize(30720)
  @Expose()
  file: Express.Multer.File
}

export class CertificateBusinessFileDto {
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @IsFileType([FileType.JPG, FileType.PNG, FileType.PDF])
  @MaxFileSize(30720)
  @Expose()
  file: Express.Multer.File
}

export class MemorandumArticlesFileDto {
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @IsFileType([FileType.JPG, FileType.PNG, FileType.PDF])
  @MaxFileSize(30720)
  @Expose()
  file: Express.Multer.File
}

export class OfficialCompanyReportFileDto {
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @IsFileType([FileType.JPG, FileType.PNG, FileType.PDF])
  @MaxFileSize(30720)
  @Expose()
  file: Express.Multer.File
}

export class LetterAuthorirationFileDto {
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @IsFileType([FileType.JPG, FileType.PNG, FileType.PDF])
  @MaxFileSize(30720)
  @Expose()
  file: Express.Multer.File
}

export class SupplementaryInformationFileDto {
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @IsFileType([FileType.JPG, FileType.PNG, FileType.PDF])
  @MaxFileSize(30720)
  @Expose()
  file: Express.Multer.File
}

export const KycFileDtoMap = {
  [KycIdDocumentMetadata.ID_CARD_FRONT]: IdCardFrontFileDto,
  [KycIdDocumentMetadata.ID_CARD_BACK]: IdCardBackFileDto,
  [KycIdDocumentMetadata.PASSPORT]: PassportFileDto,
  [KycIdDocumentMetadata.DRIVING_LICENCE_FRONT]: DrivingLicenceFrontFileDto,
  [KycIdDocumentMetadata.DRIVING_LICENCE_BACK]: DrivingLicenceBackFileDto,
  [KycIdDocumentMetadata.NUMBER_CARD_FRONT]: NumberCardFrontFileDto,
  // [KycIdDocumentMetadata.NUMBER_CARD_BACK]: NumberCardBackFileDto,
  [KycIdDocumentMetadata.SELFIE]: SelfieFileDto,
  [KycIdDocumentMetadata.FACE_RECOGNITION]: FaceRecognitionFileDto,
  [KycIdDocumentMetadata.ADDITION_DOCUMENTS]: AdditionDocumentFileDto,
  [KycIdDocumentMetadata.CERTIFICATE_BUSINESS]: CertificateBusinessFileDto,
  [KycIdDocumentMetadata.MEMORANDUM_ARTICLES]: MemorandumArticlesFileDto,
  [KycIdDocumentMetadata.LETTER_AUTHORIZATION]: LetterAuthorirationFileDto,
  [KycIdDocumentMetadata.OFFICIAL_COMPANY_REPORT]: OfficialCompanyReportFileDto,
  [KycIdDocumentMetadata.SUPPLEMENTARY_INFORMATION]:
    SupplementaryInformationFileDto,
}

export function getKycFileDto(metadata: KycIdDocumentMetadata): KycFileDto {
  return KycFileDtoMap[metadata]
}

export type KycFileDto =
  | typeof IdCardFrontFileDto
  | typeof IdCardBackFileDto
  | typeof PassportFileDto
  | typeof DrivingLicenceFrontFileDto
  | typeof DrivingLicenceBackFileDto
  | typeof NumberCardFrontFileDto
  // | typeof NumberCardBackFileDto
  | typeof SelfieFileDto
  | typeof FaceRecognitionFileDto
  | typeof AdditionDocumentFileDto
  | typeof CertificateBusinessFileDto
  | typeof MemorandumArticlesFileDto
  | typeof LetterAuthorirationFileDto
  | typeof OfficialCompanyReportFileDto
  | typeof SupplementaryInformationFileDto
