import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import jwt from 'config/jwt'
import { DeviceModule } from '@lib/device'
import { AccessTokenService } from './services/access-token.service'
import { AuthorizationCodeService } from './services/authorization-code.service'
import { RefreshTokenService } from './services/refresh-token.service'

@Module({
  imports: [
    JwtModule.register({
      signOptions: {
        algorithm: 'RS256',
      },
    }),
    ConfigModule.forRoot({ load: [jwt] }),
    DeviceModule,
  ],
  providers: [
    AuthorizationCodeService,
    AccessTokenService,
    RefreshTokenService,
  ],
  exports: [AuthorizationCodeService, AccessTokenService, RefreshTokenService],
})
export class AuthorizationModule {}
