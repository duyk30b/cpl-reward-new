import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { HttpModule } from '@nestjs/axios'
import { AuthorizationModule } from '@lib/authorization'
import { AdminModule } from '@lib/admin'
import { RolePermissionModule } from '@lib/role-permission'
import { AbilityModule } from '../ability/ability.module'
import { ApiReasonController } from './reason/api-reason.controller'
import { ApiReasonService } from './reason/api-reason.service'
import { ReasonCategoryModule } from '@lib/grpc-client/reason/reason-category.module'
import { ApiReasonCategoryController } from './reason-category/api-reason-category.controller'
import { ApiReasonCategoryService } from './reason-category/api-reason-category.service'
import { ReasonModule } from '@lib/grpc-client/reason/reason.module'

@Module({
  imports: [
    AuthorizationModule,
    AdminModule,
    ConfigModule,
    HttpModule,
    RolePermissionModule,
    AbilityModule,
    ReasonCategoryModule,
    ReasonModule,
  ],
  controllers: [ApiReasonController, ApiReasonCategoryController],
  providers: [ApiReasonService, ApiReasonCategoryService],
})
export class ApiReasonModule {}
