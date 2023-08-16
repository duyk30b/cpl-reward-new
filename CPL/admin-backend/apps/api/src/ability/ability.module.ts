import { AdminModule } from '@lib/admin'
import { Module } from '@nestjs/common'
import { RolePermissionModule } from 'libs/role-permission/src/role-permission.module'

@Module({
  imports: [RolePermissionModule, AdminModule],
  providers: [],
  exports: [RolePermissionModule, AdminModule],
})
export class AbilityModule {}
