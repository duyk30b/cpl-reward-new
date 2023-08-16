import { AdminModule } from '@lib/admin'
import { AuthorizationModule } from '@lib/authorization'
import { ChannelModule } from '@lib/grpc-client/channel'
import { RolePermissionModule } from '@lib/role-permission'
import { Module } from '@nestjs/common'
import { AbilityModule } from '../ability/ability.module'
import { ApiChannelController } from './api-channel.controller'
import { ApiChannelService } from './api-channel.service'

@Module({
  imports: [
    ChannelModule,
    AuthorizationModule,
    AdminModule,
    RolePermissionModule,
    AbilityModule,
  ],
  controllers: [ApiChannelController],
  providers: [ApiChannelService],
})
export class ApiChannelModule {}
