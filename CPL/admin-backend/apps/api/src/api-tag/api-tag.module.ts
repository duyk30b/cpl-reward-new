import { AdminModule } from '@lib/admin'
import { AuthorizationModule } from '@lib/authorization'
import { TagModule } from '@lib/grpc-client/tag'
import { RolePermissionModule } from '@lib/role-permission'
import { Module } from '@nestjs/common'
import { AbilityModule } from '../ability/ability.module'
import { ApiTagController } from './api-tag.controller'
import { ApiTagService } from './api-tag.service'

@Module({
  imports: [
    AuthorizationModule,
    AdminModule,
    TagModule,
    RolePermissionModule,
    AbilityModule,
  ],
  controllers: [ApiTagController],
  providers: [ApiTagService],
})
export class ApiTagModule {}
