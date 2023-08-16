import { MiddlewareConsumer, Module } from '@nestjs/common'
import { UserModule } from '@lib/grpc-client/user'
import { AuthorizationModule } from '@lib/authorization'
import { AdminModule } from '@lib/admin'
import { RolePermissionModule } from '@lib/role-permission'
import { AbilityModule } from '../../ability/ability.module'
import { UnlimitedUserController } from './unlimited-user.controller'
import { UnlimitedUserService } from './unlimited-user.service'
import { GrpcUnlimitedUserModule } from '@lib/grpc-client/bo/unlimited-user/unlimited-user.module'
@Module({
  imports: [
    AuthorizationModule,
    AdminModule,
    UserModule,
    RolePermissionModule,
    AbilityModule,
    GrpcUnlimitedUserModule,
  ],
  controllers: [UnlimitedUserController],
  providers: [UnlimitedUserService],
})
export class UnlimitedUserModule {
  async configure(consumer: MiddlewareConsumer) {
    // await consumer
    //   .apply(ValidateAccessTokenMiddleware)
    //   .forRoutes(ApiBOUnlimitedUserController)
  }
}
