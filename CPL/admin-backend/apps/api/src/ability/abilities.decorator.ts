import { SetMetadata } from '@nestjs/common'

export const CHECK_ABILITY = 'check_ability'

export const CheckAbilities = (permission) =>
  SetMetadata(CHECK_ABILITY, permission)
