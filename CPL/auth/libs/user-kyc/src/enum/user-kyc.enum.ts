export enum KycIdDocumentType {
  PASSPORT = 1,
  ID_CARD = 2,
  DRIVING_LICENCE = 3,
  OTHERS = 4,
  RESIDENCE_CARD = 5,
  NUMBER_CARD = 6,
}

export enum KycIdDocumentMetadata {
  ID_CARD_FRONT = 'ID_CARD_FRONT',
  ID_CARD_BACK = 'ID_CARD_BACK',
  PASSPORT = 'PASSPORT',
  DRIVING_LICENCE_FRONT = 'DRIVING_LICENCE_FRONT',
  DRIVING_LICENCE_BACK = 'DRIVING_LICENCE_BACK',
  RESIDENCE_CARD_FRONT = 'RESIDENCE_CARD_FRONT',
  RESIDENCE_CARD_BACK = 'RESIDENCE_CARD_BACK',
  NUMBER_CARD_FRONT = 'NUMBER_CARD_FRONT',
  // NUMBER_CARD_BACK = 'NUMBER_CARD_BACK',
  SELFIE = 'SELFIE',
  ADDITION_DOCUMENTS = 'ADDITION_DOCUMENTS',
  CERTIFICATE_BUSINESS = 'CERTIFICATE_BUSINESS',
  MEMORANDUM_ARTICLES = 'MEMORANDUM_ARTICLES',
  OFFICIAL_COMPANY_REPORT = 'OFFICIAL_COMPANY_REPORT',
  LETTER_AUTHORIZATION = 'LETTER_AUTHORIZATION',
  SUPPLEMENTARY_INFORMATION = 'SUPPLEMENTARY_INFORMATION',
  FACE_RECOGNITION = 'FACE_RECOGNITION',
  OTHERS = 'OTHERS',
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

export enum KycImageProvider {
  CYNOPSIS = 1,
  AMAZON = 2,
  SUMSUB = 3,
}

export enum KycRiskScanProvider {
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

export enum KycFilterType {
  APPROVED = 'verified',
  UNAPPROVED = 'verifying',
  INADEQUACY = 'rejected',
  OTHER = 'pending',
}

export enum CompareStatus {
  MATCHED = 1,
  NOT_MATCHED = 2,
  UNCERTAIN = 3,
  ERROR = 4,
  NOT_RUNNING_YET = 5,
}

export enum RiskScanStatus {
  DONE = 1,
  ERROR = 4,
  NOT_RUNNING_YET = 5,
}

export enum DuplicateStatus {
  NOT_DUPLICATE = 1,
  HAVE_DUPLICATE = 2,
  WARNING = 3,
  UNKNOWN = 4,
}

export enum LivenessStatus {
  PASS = 1,
  FAIL = 2,
  UNKNOWN = 3,
}

export enum IdentityDocumentVerificationStatus {
  PASS = 1,
  FAIL = 2,
  UNKNOWN = 3,
}
