import { removeTrailingZeros } from '@/core/helpers/util'
import { Transform } from 'class-transformer'

export class TrezorWallet {
  id: number
  symbol: string
  chainCode: string
  address: string
  tag: string
  path: string

  @Transform(({ value }) => removeTrailingZeros(value))
  balance: string
  status: string
  updated_at?: string
  is_selected = false
}

export class CollectorAddress {
  chainCode: string
  address: string
  feeLimit: string
  feePrice: string
}

export enum TREZOR_WALLET_STATUS {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  DONE = 'DONE',
}
