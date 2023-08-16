import { Module } from '@nestjs/common'
import { ApiSettingController } from './api-setting.controller'
import { SettingModule } from '@lib/grpc-client/setting/setting.module'
import { ApiSettingService } from './api-setting.service'
import { AuthorizationModule } from '@lib/authorization'
import { AdminModule } from '@lib/admin'
import { RolePermissionModule } from '@lib/role-permission'
import { AbilityModule } from '../ability/ability.module'

@Module({
  imports: [
    AuthorizationModule,
    AdminModule,
    SettingModule,
    RolePermissionModule,
    AbilityModule,
  ],
  controllers: [ApiSettingController],
  providers: [ApiSettingService],
})
export class ApiSettingModule {}
