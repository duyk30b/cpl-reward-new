import { Exclude } from 'class-transformer'

@Exclude()
export class UserZeroFeeItem {
  user_id: string
  email?: string
}

@Exclude()
export class UpdateUserZeroFee extends UserZeroFeeItem {
  pairs: { coin: string; currency: string }[]
}
