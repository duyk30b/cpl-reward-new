export enum UserPasswordEncryptor {
  AUTH = 1,
  BCE = 2,
}

export enum UserEmailVerifyStatus {
  VERIFIED = 1,
  UNVERIFIED = 2,
}

export enum UserAuthenticatorVerifyStatus {
  VERIFIED = 1,
  UNVERIFIED = 2,
}

export enum UserKycVerifyStatus {
  VERIFIED = 1,
  UNVERIFIED = 2,
  PENDING = 3,
  REJECTED = 4,
}

export enum UserStatus {
  ACTIVE = 1,
  INACTIVE = 2,
  PENDING_DELETE = 3,
}

export enum UserType {
  NORMAL = 1,
  BOT = 2,
  FUND_USER = 3,
}

export enum UserInfoStatus {
  UPDATED = 1,
  NOT_UPDATED = 2,
}

export enum AcceptLawStatus {
  ACCEPTED = 1,
  NOT_ACCEPTED = 2,
}

export enum TutorialType {
  EXCHANGE = 'exchange',
  BO = 'bo',
}

export enum TutorialStatus {
  ON = 1,
  OFF = 2,
}
