export enum DEPOSIT_TRANSACTION_STATUS {
  CONFIRMATION = 'CONFIRMATION',
  UN_CONFIRMATION = 'UN_CONFIRMATION',
  FAILED = 'FAILED',
}

export enum WITHDRAW_TRANSACTION_STATUS {
  APPROVED_CONTRACT = 'APPROVED_CONTRACT', //* Only use for submit approve transaction of erc20
  // REJECT = 'REJECT',
  // PENDING = 'PENDING',
  SIGNED = 'SIGNED',
  CONFIRMED = 'CONFIRMED',
  FAILED_SIGN = 'FAILED_SIGN',
  FAILED_CHECK_CONFIRMATION = 'FAILED_CHECK_CONFIRMATION',
  IN_SIGNING_QUEUE = 'IN_SIGNING_QUEUE',
  IN_CONFIRMATION_QUEUE = 'IN_CONFIRMATION_QUEUE',
}

export enum DEPOSIT_QUEUE_STATUS {
  PROCESSING = 'PROCESSING',
  DONE = 'DONE',
}

export enum DOMAIN {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  COLLECTION = 'COLLECTION',
  INCIDENCE = 'INCIDENCE',
}

export enum WITHDRAWINTERACTOR {
  USER = 'USER',
  MOTHER = 'MOTHER',
}

export enum TRANSACTION_QUEUE_STATUS {
  PROCESSING = 'PROCESSING',
  DONE = 'DONE',
}

export enum MANUAL_TRANSACTION_ACTION {
  CREATE = 'CREATE',
  RETRY = 'RETRY',
  FORCE_STOP = 'FORCE_STOP',
}

export const LIMIT_EXPORT_MONTHS = 6
