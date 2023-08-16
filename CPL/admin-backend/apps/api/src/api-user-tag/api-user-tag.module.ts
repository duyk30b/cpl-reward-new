import { AdminModule } from '@lib/admin'
import { AuthorizationModule } from '@lib/authorization'
import { UserTagModule } from '@lib/grpc-client/user-tag'
import { RolePermissionModule } from '@lib/role-permission'
import { Module } from '@nestjs/common'
import { AbilityModule } from '../ability/ability.module'
import { ApiUserTagController } from './api-user-tag.controller'
import { ApiUserTagService } from './api-user-tag.service'

@Module({
  imports: [
    AuthorizationModule,
    AdminModule,
    UserTagModule,
    RolePermissionModule,
    AbilityModule,
  ],
  controllers: [ApiUserTagController],
  providers: [ApiUserTagService],
})
export class ApiUserTagModule {}
