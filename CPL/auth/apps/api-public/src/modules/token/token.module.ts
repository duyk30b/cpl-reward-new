import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { TokenService } from './token.service'
import { TokenController } from './token.controller'
import { AuthorizationModule } from '@lib/authorization'
import { ConfigModule } from '@nestjs/config'
import jwt from 'config/jwt'
import { UserModule } from '@lib/user'
import { ValidateRefreshTokenMiddleware } from '../../middlewares/validate-refresh-token.middleware'
import { DeviceModule } from '@lib/device'
import { BlacklistModule } from '@lib/blacklist'

@Module({
  imports: [
    AuthorizationModule,
    ConfigModule.forRoot({ load: [jwt] }),
    UserModule,
    DeviceModule,
    BlacklistModule,
  ],
  controllers: [TokenController],
  providers: [TokenService],
})
export class TokenModule implements NestModule {
  async configure(consumer: MiddlewareConsumer) {
    await consumer
      .apply(ValidateRefreshTokenMiddleware)
      .forRoutes(TokenController)
  }
}
