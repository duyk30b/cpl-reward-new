import { BalanceType } from './grpc-services/transaction/transaction.enum'

export interface ISendReward {
  userId: string
  amount: string
  currency: string
  referenceId: string
  balance: BalanceType
}
