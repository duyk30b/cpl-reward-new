import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RolePermissionService } from './services/role-permission.service'
import { RolePermissionEntity } from './entities/role-permission.entity'
import { RoleEntity } from './entities/role.entity'
import { UserPermissionEntity } from './entities/user-permission.entity'
import { UserRoleEntity } from './entities/user-role.entity'
import { RoleService } from './services/role.service'
import { PermissionAggregateService } from './services/permission-aggregate.service'
import { UserPermissionService } from './services/user-permission.service'
import { UserRoleService } from '.'
import { RedisModule } from '@lib/redis'
import { PermissionListener } from './permission.listener'
import { RoleScreenEntity } from '@lib/role-permission/entities/role-screen.entity'
import { AdminScreenEntity } from '@lib/role-permission/entities/admin-screen.entity'
import { AdminScreenService } from '@lib/role-permission/services/user-screen.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoleEntity,
      RolePermissionEntity,
      UserPermissionEntity,
      UserRoleEntity,
      AdminScreenEntity,
      RoleScreenEntity,
    ]),
    RedisModule,
  ],
  providers: [
    RolePermissionService,
    RoleService,
    UserRoleService,
    PermissionAggregateService,
    UserPermissionService,
    AdminScreenService,
    PermissionListener,
  ],
  exports: [
    RolePermissionService,
    RoleService,
    UserRoleService,
    PermissionAggregateService,
    UserPermissionService,
    AdminScreenService,
  ],
})
export class RolePermissionModule {}
