import { MiddlewareConsumer, Module } from '@nestjs/common'
import { UserModule } from '@lib/grpc-client/user'
import { AuthorizationModule } from '@lib/authorization'
import { AdminModule } from '@lib/admin'
import { RolePermissionModule } from '@lib/role-permission'
import { AbilityModule } from '../../ability/ability.module'
import { GrpcSwapsModule } from '@lib/grpc-client/bo/swaps'
import { SwapsService } from './swaps.service'
import { SwapsController } from './swaps.controller'
@Module({
  imports: [
    AuthorizationModule,
    AdminModule,
    UserModule,
    RolePermissionModule,
    AbilityModule,
    GrpcSwapsModule,
  ],
  controllers: [SwapsController],
  providers: [SwapsService],
})
export class BOSwapsModule {
  async configure(consumer: MiddlewareConsumer) {
    // await consumer
    //   .apply(ValidateAccessTokenMiddleware)
    //   .forRoutes(ApiBOUnlimitedUserController)
  }
}
