export enum WithdrawGroupEnum {
  CREATE = 'created',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCEL = 'cancel',
}

export enum WithdrawAutoEnum {
  WAITING = 'waiting',
  SIGNING_QUEUE = 'signing_queue',
  CONFIRMATION_QUEUE = 'confirmation_queue',
  COMPLETED = 'completed',
  CANCEL = 'cancel',
  FAILED = 'failed',
}
