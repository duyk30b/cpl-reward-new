import { MiddlewareConsumer, Module } from '@nestjs/common'
import { UserModule } from '@lib/grpc-client/user'
import { AuthorizationModule } from '@lib/authorization'
import { AdminModule } from '@lib/admin'
import { RolePermissionModule } from '@lib/role-permission'
import { AbilityModule } from '../../ability/ability.module'
import { TradingPairController } from './trading-pair.controller'
import { TradingPairService } from './trading-pair.service'
import { GrpcTradingPairModule } from '@lib/grpc-client/bo/trading-pair/trading-pair.module'
@Module({
  imports: [
    AuthorizationModule,
    AdminModule,
    UserModule,
    RolePermissionModule,
    AbilityModule,
    GrpcTradingPairModule,
  ],
  controllers: [TradingPairController],
  providers: [TradingPairService],
})
export class TradingPairModule {
  async configure(consumer: MiddlewareConsumer) {
    // await consumer
    //   .apply(ValidateAccessTokenMiddleware)
    //   .forRoutes(ApiBOTradingController)
  }
}
