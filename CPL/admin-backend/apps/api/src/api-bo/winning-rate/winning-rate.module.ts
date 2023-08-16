import { MiddlewareConsumer, Module } from '@nestjs/common'
import { AuthorizationModule } from '@lib/authorization'
import { AdminModule } from '@lib/admin'
import { RolePermissionModule } from '@lib/role-permission'
import { AbilityModule } from '../../ability/ability.module'
import { WinningRateController } from './winning-rate.controller'
import { WinningRateService } from './winning-rate.service'
import { GrpcWinningRateModule } from '@lib/grpc-client/bo/winning-rate/winning-rate.module'
import { UserModule } from '@lib/grpc-client/user'

@Module({
  imports: [
    AuthorizationModule,
    AdminModule,
    UserModule,
    RolePermissionModule,
    AbilityModule,
    GrpcWinningRateModule,
  ],
  controllers: [WinningRateController],
  providers: [WinningRateService],
})
export class WinningRateModule {
  async configure(consumer: MiddlewareConsumer) {
    // await consumer
    //   .apply(ValidateAccessTokenMiddleware)
    //   .forRoutes(ApiBOTradingController)
  }
}
