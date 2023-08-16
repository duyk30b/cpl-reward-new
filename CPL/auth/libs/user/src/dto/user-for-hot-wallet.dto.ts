import { Expose } from 'class-transformer'

export class UserForHotWalletDto {
  @Expose({
    name: 'user_id',
  })
  userId: number

  @Expose()
  email: string
}
