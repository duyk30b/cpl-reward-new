import { Module } from '@nestjs/common'
import { ApiAuthService } from './api-auth.service'
import { ApiAuthController } from './api-auth.controller'
import { AuthorizationModule } from '@lib/authorization'
import { AdminModule } from '@lib/admin'
import { OtpModule } from '@lib/otp'
import { NotificationModule } from '@lib/grpc-client/notification'
import { ConfigModule } from '@nestjs/config'
import jwt from 'config/jwt'

@Module({
  imports: [
    AuthorizationModule,
    AdminModule,
    OtpModule,
    NotificationModule,
    ConfigModule.forRoot({ load: [jwt] }),
  ],
  controllers: [ApiAuthController],
  providers: [ApiAuthService],
})
export class ApiAuthModule {}
