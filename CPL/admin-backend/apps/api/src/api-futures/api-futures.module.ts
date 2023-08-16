import { AdminModule } from '@lib/admin'
import { AuthorizationModule } from '@lib/authorization'
import { RolePermissionModule } from '@lib/role-permission'
import { Module } from '@nestjs/common'
import { AbilityModule } from '../ability/ability.module'
import { ApiFuturesService } from './api-futures.service'
import { ApiFuturesController } from './api-futures.controller'
import { FuturesSettingModule } from '@lib/grpc-client/common-setting/futures-setting/futures-setting.module'
import { FuturesIntegrateModule } from '@lib/grpc-client/futures/integrate/futures-integrate.module'
import { UserModule } from '@lib/grpc-client/user'
import { FuturesCoreModule } from '@lib/grpc-client/futures/core/futures-core.module'

@Module({
  imports: [
    UserModule,
    FuturesIntegrateModule,
    FuturesSettingModule,
    FuturesCoreModule,
    AuthorizationModule,
    AdminModule,
    RolePermissionModule,
    AbilityModule,
  ],
  providers: [ApiFuturesService],
  controllers: [ApiFuturesController],
})
export class ApiFuturesModule {}
