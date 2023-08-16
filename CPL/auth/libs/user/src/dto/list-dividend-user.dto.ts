import { UserStatus, UserType } from '../enum/user.enum'

interface WhereDividendUser {
  isBanned?: boolean
  statuses?: UserStatus[]
  types?: UserType[]
}

export interface ListDividendUserDto {
  where: WhereDividendUser
  page?: number
  take?: number
}
