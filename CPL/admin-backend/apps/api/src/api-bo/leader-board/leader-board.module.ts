import { MiddlewareConsumer, Module } from '@nestjs/common'
import { UserModule } from '@lib/grpc-client/user'
import { AuthorizationModule } from '@lib/authorization'
import { AdminModule } from '@lib/admin'
import { RolePermissionModule } from '@lib/role-permission'
import { AbilityModule } from '../../ability/ability.module'
import { LeaderBoardController } from './leader-board.controller'
import { LeaderBoardService } from './leader-board.service'
import { GrpcCacheManagementModule } from '@lib/grpc-client/bo/cache-management'
@Module({
  imports: [
    AuthorizationModule,
    AdminModule,
    UserModule,
    RolePermissionModule,
    AbilityModule,
    GrpcCacheManagementModule,
  ],
  controllers: [LeaderBoardController],
  providers: [LeaderBoardService],
})
export class LeaderBoardModule {
  async configure(consumer: MiddlewareConsumer) {
    // await consumer
    //   .apply(ValidateAccessTokenMiddleware)
    //   .forRoutes(ApiBOUnlimitedUserController)
  }
}
