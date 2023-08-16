import { MiddlewareConsumer, Module } from '@nestjs/common'
import { UserModule } from '@lib/grpc-client/user'
import { AuthorizationModule } from '@lib/authorization'
import { AdminModule } from '@lib/admin'
import { RolePermissionModule } from '@lib/role-permission'
import { AbilityModule } from '../../ability/ability.module'
import { PairPriceController } from './pair-price.controller'
import { PairPriceService } from './pair-price.service'
import { GrpcPairPriceModule } from '@lib/grpc-client/bo/pair-price/pair-price.module'
@Module({
  imports: [
    AuthorizationModule,
    AdminModule,
    UserModule,
    RolePermissionModule,
    AbilityModule,
    GrpcPairPriceModule,
  ],
  controllers: [PairPriceController],
  providers: [PairPriceService],
})
export class PairPriceModule {
  async configure(consumer: MiddlewareConsumer) {
    // await consumer
    //   .apply(ValidateAccessTokenMiddleware)
    //   .forRoutes(ApiBOTradingController)
  }
}
