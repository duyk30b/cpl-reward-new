export enum KycIdDocumentType {
  PASSPORT = 1,
  ID_CARD = 2,
  DRIVING_LICENCE = 3,
  OTHERS = 4,
}

export enum KycIdDocumentMetadata {
  ID_CARD_FRONT = 'ID_CARD_FRONT',
  ID_CARD_BACK = 'ID_CARD_BACK',
  PASSPORT = 'PASSPORT',
  DRIVE_LICENSE = 'DRIVE_LICENSE',
  SELFIE = 'SELFIE',
  ADDITION_DOCUMENTS = 'ADDITION_DOCUMENTS',
  CERTIFICATE_BUSINESS = 'CERTIFICATE_BUSINESS',
  MEMORANDUM_ARTICLES = 'MEMORANDUM_ARTICLES',
  OFFICIAL_COMPANY_REPORT = 'OFFICIAL_COMPANY_REPORT',
  LETTER_AUTHORIZATION = 'LETTER_AUTHORIZATION',
  SUPPLEMENTARY_INFORMATION = 'SUPPLEMENTARY_INFORMATION',
}

export enum KycType {
  PERSONAL = 1,
  ENTERPRISE = 2,
}

export enum KycStatus {
  ACCEPT = 1,
  REJECT = 2,
  PENDING = 3,
  APPROVED_PAPER = 4,
  NEW = 5,
  AUTO_KYC_PROCESSED = 7,
  PENDING_PAPER = 8,
}

export enum Kyc3rdProvider {
  CYNOPSIS = 1,
}

export enum UserRelatedPartyType {
  INDIVIDUAL = 1,
  CORPORATE = 2,
}

export enum RiskRating {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  UNKNOWN = 4,
  FAIL_INFO = 5,
  SCREENING = 6,
}

export enum ExportType {
  ExportUserBasicInfoType = 'user-basic-info',
  ExportUserTagType = 'user-tag',
}

export enum BanUserErrorMessage {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  ALREADY_BANNED = 'ALREADY_BANNED',
}

export const UserErrorMessage = {
  USER_NOT_FOUND: 'USER_NOT_FOUND',
}
