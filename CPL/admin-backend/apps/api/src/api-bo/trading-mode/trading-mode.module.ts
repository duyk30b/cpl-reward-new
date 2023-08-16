import { MiddlewareConsumer, Module } from '@nestjs/common'
import { UserModule } from '@lib/grpc-client/user'
import { AuthorizationModule } from '@lib/authorization'
import { AdminModule } from '@lib/admin'
import { RolePermissionModule } from '@lib/role-permission'
import { AbilityModule } from '../../ability/ability.module'
import { TradingModeController } from './trading-mode.controller'
import { TradingModeService } from './trading-mode.service'
import { HttpModule } from '@nestjs/axios'
import { GrpcTradingModeModule } from '@lib/grpc-client/bo/trading-mode'

@Module({
  imports: [
    AuthorizationModule,
    AdminModule,
    UserModule,
    RolePermissionModule,
    AbilityModule,
    GrpcTradingModeModule,
    HttpModule,
  ],
  controllers: [TradingModeController],
  providers: [TradingModeService],
})
export class TradingModeModule {
  async configure(consumer: MiddlewareConsumer) {
    // await consumer
    //   .apply(ValidateAccessTokenMiddleware)
    //   .forRoutes(ApiBOSettingController)
  }
}
