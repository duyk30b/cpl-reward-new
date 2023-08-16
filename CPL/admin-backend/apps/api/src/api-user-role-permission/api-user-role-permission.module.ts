import { AdminModule } from '@lib/admin'
import { AuthorizationModule } from '@lib/authorization'
import { Module } from '@nestjs/common'
import { RolePermissionModule } from 'libs/role-permission/src'
import { AbilityModule } from '../ability/ability.module'
import { ApiPermissionController } from './controllers/api-permission.controller'
import { ApiRoleController } from './controllers/api-role.controller'
import { ApiUserRolePermissionController } from './controllers/api-user-role-permission.controller'
import { ApiPermissionService } from './services/api-permission.service'
import { ApiRoleService } from './services/api-role.service'
import { ApiUserRolePermissionService } from './services/api-user-role-permission.service'

@Module({
  imports: [
    RolePermissionModule,
    AbilityModule,
    AuthorizationModule,
    AdminModule,
  ],
  controllers: [
    ApiRoleController,
    ApiUserRolePermissionController,
    ApiPermissionController,
  ],
  providers: [
    ApiRoleService,
    ApiUserRolePermissionService,
    ApiPermissionService,
  ],
})
export class ApiUserRolePermissionModule {}
