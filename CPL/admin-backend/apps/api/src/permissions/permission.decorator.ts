import { applyDecorators, UseGuards } from '@nestjs/common'
import { CheckAbilities } from '../ability/abilities.decorator'
import { AbilitiesGuard } from '../ability/abilities.guard'

export function CheckPermission(permissionId: number) {
  return applyDecorators(
    UseGuards(AbilitiesGuard),
    CheckAbilities(permissionId),
  )
}
