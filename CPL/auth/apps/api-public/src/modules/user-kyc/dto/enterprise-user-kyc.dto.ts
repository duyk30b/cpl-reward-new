import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { AuthValidationError, StringDateBeforeToday } from '@lib/util'
import { getEnumComment, getEnumValues } from '@lib/util'
import { KycIdDocumentType } from '@lib/user-kyc/enum/user-kyc.enum'
import { Expose } from 'class-transformer'
import {
  ArrayMaxSize,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator'
import { UserRelatedPartyDto } from './user-related-party.dto'
import { TransformTrim } from '@lib/util'
import { TWO_SIDE_DOCUMENT_TYPES } from '@lib/user/const/user-kyc.const'

export class EnterpriseUserKycDto {
  @ApiProperty({ name: 'company_name' })
  @Expose({ name: 'company_name' })
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @MaxLength(255, { message: AuthValidationError.MAX_LENGTH })
  @TransformTrim()
  companyName: string

  @ApiProperty({ name: 'applicant_name' })
  @Expose({ name: 'applicant_name' })
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @MaxLength(100, { message: AuthValidationError.MAX_LENGTH })
  @TransformTrim()
  applicantName: string

  @ApiProperty({ name: 'company_register_country' })
  @Expose({ name: 'company_register_country' })
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @TransformTrim()
  companyRegisterCountry: number

  @ApiProperty({ name: 'contact_number' })
  @Expose({ name: 'contact_number' })
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @Matches(/^\d+$/, {
    message: AuthValidationError.MATCHES,
  })
  @MinLength(3, { message: AuthValidationError.MIN_LENGTH })
  @MaxLength(255, { message: AuthValidationError.MAX_LENGTH })
  @TransformTrim()
  contactNumber: string

  @ApiProperty({ name: 'company_location' })
  @Expose({ name: 'company_location' })
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @MaxLength(250, { message: AuthValidationError.MAX_LENGTH })
  @TransformTrim()
  companyLocation: string

  @ApiProperty({ name: 'applicant_job_title' })
  @Expose({ name: 'applicant_job_title' })
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @MaxLength(100, { message: AuthValidationError.MAX_LENGTH })
  @TransformTrim()
  applicantJobTitle: string

  @ApiProperty({ name: 'sources_funding' })
  @Expose({ name: 'sources_funding' })
  @ValidateIf((obj, value) => !!value)
  @Matches(/^\d+$/, {
    message: AuthValidationError.IS_NUMBER,
  })
  @MaxLength(255, {
    message: AuthValidationError.MAX_LENGTH,
  })
  sourcesFunding: string

  @ApiProperty({ name: 'funding_currency' })
  @Expose({ name: 'funding_currency' })
  @ValidateIf((obj, value) => !!value)
  @TransformTrim()
  fundingCurrency: string

  @ApiProperty({ name: 'url_website' })
  @Expose({ name: 'url_website' })
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @MaxLength(255, { message: AuthValidationError.MAX_LENGTH })
  @TransformTrim()
  urlWebsite: string

  @ApiProperty({ name: 'entity_type' })
  @Expose({ name: 'entity_type' })
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @TransformTrim()
  entityType: string

  @ApiProperty({ name: 'registered_date' })
  @Expose({ name: 'registered_date' })
  @IsISO8601(
    { strict: true },
    {
      message: AuthValidationError.IS_DATE,
    },
  )
  @Matches(/^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/, {
    message: AuthValidationError.IS_DATE,
  })
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @StringDateBeforeToday({
    message: AuthValidationError.MAX_DATE,
  })
  registeredDate: string

  @ApiProperty({ name: 'ownership_structure_layer' })
  @Expose({ name: 'ownership_structure_layer' })
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @TransformTrim()
  ownershipStructureLayer: string

  @ApiProperty({ name: 'incorporation_number' })
  @Expose({ name: 'incorporation_number' })
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @MaxLength(255, { message: AuthValidationError.MAX_LENGTH })
  @Matches(/^\d+$/, {
    message: AuthValidationError.MATCHES,
  })
  @TransformTrim()
  incorporationNumber: string

  @ApiProperty({ name: 'reason_apply' })
  @Expose({ name: 'reason_apply' })
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @MaxLength(250, { message: AuthValidationError.MAX_LENGTH })
  @TransformTrim()
  reasonApply: string

  @ApiProperty({
    name: 'id_document_type',
    description: getEnumComment(KycIdDocumentType),
    enum: getEnumValues(KycIdDocumentType),
  })
  @IsEnum(getEnumValues(KycIdDocumentType), {
    message: AuthValidationError.IS_ENUM,
  })
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @Expose({ name: 'id_document_type' })
  idDocumentType: number

  @ApiProperty({
    name: 'id_document_no',
  })
  @IsOptional()
  @Expose({ name: 'id_document_no' })
  idDocumentNo: string

  @ApiProperty({ name: 'document_front' })
  @Expose({ name: 'document_front' })
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  documentFront: string

  @ApiProperty({ name: 'document_back', required: false })
  @Expose({ name: 'document_back' })
  @ValidateIf((o) =>
    TWO_SIDE_DOCUMENT_TYPES.some((type) => o.idDocumentType == type),
  )
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  documentBack: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  selfie: string

  @ApiProperty({
    name: 'addition_documents',
    type: 'array',
    items: {
      type: 'string',
    },
    maxItems: 5,
    required: false,
  })
  @Expose({ name: 'addition_documents' })
  @IsOptional()
  @ArrayMaxSize(5, { message: AuthValidationError.ARRAY_MAX_SIZE })
  additionDocuments: string[]

  @ApiProperty({ name: 'certificate_business' })
  @Expose({ name: 'certificate_business' })
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  certificateBusiness: string

  @ApiProperty({ name: 'memorandum_articles' })
  @Expose({ name: 'memorandum_articles' })
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  memorandumArticles: string

  @ApiProperty({ name: 'official_company_report' })
  @Expose({ name: 'official_company_report' })
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  officialCompanyReport: string

  @ApiProperty({ name: 'letter_authoriration' })
  @Expose({ name: 'letter_authoriration' })
  @IsOptional()
  letterAuthoriration: string

  @ApiProperty({ name: 'supplementary_information' })
  @Expose({ name: 'supplementary_information' })
  @IsOptional()
  supplementaryInformation: string

  @ApiProperty({
    name: 'user_related_parties',
    type: [UserRelatedPartyDto],
    required: false,
  })
  @Expose({ name: 'user_related_parties' })
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => UserRelatedPartyDto)
  userRelatedParties: UserRelatedPartyDto[]
}
