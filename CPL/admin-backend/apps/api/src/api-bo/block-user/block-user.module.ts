import { MiddlewareConsumer, Module } from '@nestjs/common'
import { UserModule } from '@lib/grpc-client/user'
import { AuthorizationModule } from '@lib/authorization'
import { AdminModule } from '@lib/admin'
import { RolePermissionModule } from '@lib/role-permission'
import { AbilityModule } from '../../ability/ability.module'
import { BlockUserController } from './block-user.controller'
import { BlockUserService } from './block-user.service'
import { GrpcBlockUserModule } from '@lib/grpc-client/bo/block-user/block-user.module'
@Module({
  imports: [
    AuthorizationModule,
    AdminModule,
    UserModule,
    RolePermissionModule,
    AbilityModule,
    GrpcBlockUserModule,
  ],
  controllers: [BlockUserController],
  providers: [BlockUserService],
})
export class BlockUserModule {
  async configure(consumer: MiddlewareConsumer) {
    // await consumer
    //   .apply(ValidateAccessTokenMiddleware)
    //   .forRoutes(ApiBOUnlimitedUserController)
  }
}
