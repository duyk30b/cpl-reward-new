import { MiddlewareConsumer, Module } from '@nestjs/common'
import { UserModule } from '@lib/grpc-client/user'
import { AuthorizationModule } from '@lib/authorization'
import { AdminModule } from '@lib/admin'
import { RolePermissionModule } from '@lib/role-permission'
import { AbilityModule } from '../../ability/ability.module'
import { GrpcPaymentModule } from '@lib/grpc-client/mt5/payment'
import { PaymentController } from './payment.controller'
import { PaymentService } from './payment.service'
@Module({
  imports: [
    AuthorizationModule,
    AdminModule,
    UserModule,
    RolePermissionModule,
    AbilityModule,
    GrpcPaymentModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class MT5PaymentModule {
  async configure(consumer: MiddlewareConsumer) {
    // await consumer
    //   .apply(ValidateAccessTokenMiddleware)
    //   .forRoutes(ApiBOTradingController)
  }
}
