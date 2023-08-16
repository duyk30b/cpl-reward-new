import { Module } from '@nestjs/common'
import { ApiUserService } from './api-user.service'
import { ApiUserController } from './api-user.controller'
import { UserModule } from '@lib/grpc-client/user'
import { AuthorizationModule } from '@lib/authorization'
import { AdminModule } from '@lib/admin'
import { RolePermissionModule } from '@lib/role-permission'
import { AbilityModule } from '../ability/ability.module'
import { ExternalBceModule } from '@lib/external-bce'
import { BanUserHistoryModule } from '@lib/ban-user-history'
import { UploadFileModule } from '@lib/upload-file'
import { ConfigModule } from '@nestjs/config'
import { ApiUserListener } from './api-user.listener'
import { QueueModule } from '@lib/queue'
import { ApiUserProcessor } from './api-user.processor'
import { UserKycModule } from '@lib/grpc-client/user-kyc'
import { ExchangeModule } from '@lib/grpc-client/exchange/exchange.module'

@Module({
  imports: [
    AuthorizationModule,
    AdminModule,
    UserModule,
    RolePermissionModule,
    AbilityModule,
    ExternalBceModule,
    BanUserHistoryModule,
    UploadFileModule,
    ConfigModule,
    QueueModule,
    UserKycModule,
    ExchangeModule,
  ],
  controllers: [ApiUserController],
  providers: [ApiUserService, ApiUserListener, ApiUserProcessor],
})
export class ApiUserModule {}
