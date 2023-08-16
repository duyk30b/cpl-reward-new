import { MiddlewareConsumer, Module } from '@nestjs/common'
import { UserModule } from '@lib/grpc-client/user'
import { AuthorizationModule } from '@lib/authorization'
import { AdminModule } from '@lib/admin'
import { RolePermissionModule } from '@lib/role-permission'
import { AbilityModule } from '../../ability/ability.module'
import { SettingController } from './setting.controller'
import { SettingService } from './setting.service'
import { GrpcSettingModule } from '@lib/grpc-client/bo/setting/setting.module'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [
    AuthorizationModule,
    AdminModule,
    UserModule,
    RolePermissionModule,
    AbilityModule,
    GrpcSettingModule,
    HttpModule,
  ],
  controllers: [SettingController],
  providers: [SettingService],
})
export class SettingModule {
  async configure(consumer: MiddlewareConsumer) {
    // await consumer
    //   .apply(ValidateAccessTokenMiddleware)
    //   .forRoutes(ApiBOSettingController)
  }
}
