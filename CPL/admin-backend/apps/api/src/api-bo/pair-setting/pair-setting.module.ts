import { MiddlewareConsumer, Module } from '@nestjs/common'
import { UserModule } from '@lib/grpc-client/user'
import { AuthorizationModule } from '@lib/authorization'
import { AdminModule } from '@lib/admin'
import { RolePermissionModule } from '@lib/role-permission'
import { AbilityModule } from '../../ability/ability.module'
import { PairSettingController } from './pair-setting.controller'
import { PairSettingService } from './pair-setting.service'
import { HttpModule } from '@nestjs/axios'
import { GrpcPairSettingModule } from '@lib/grpc-client/bo/pair-setting'
import { GrpcTradingPairModule } from '@lib/grpc-client/bo/trading-pair'

@Module({
  imports: [
    AuthorizationModule,
    AdminModule,
    UserModule,
    RolePermissionModule,
    AbilityModule,
    GrpcPairSettingModule,
    GrpcTradingPairModule,
    HttpModule,
  ],
  controllers: [PairSettingController],
  providers: [PairSettingService],
})
export class PairSettingModule {
  async configure(consumer: MiddlewareConsumer) {
    // await consumer
    //   .apply(ValidateAccessTokenMiddleware)
    //   .forRoutes(ApiBOSettingController)
  }
}
