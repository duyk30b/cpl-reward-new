import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import jwt from 'config/jwt'
import { AccessTokenService } from './services/access-token.service'
import { RefreshTokenService } from './services/refresh-token.service'

@Module({
  imports: [
    JwtModule.register({
      signOptions: {
        algorithm: 'RS256',
      },
    }),
    ConfigModule.forRoot({ load: [jwt] }),
  ],
  providers: [AccessTokenService, RefreshTokenService],
  exports: [AccessTokenService, RefreshTokenService],
})
export class AuthorizationModule {}
