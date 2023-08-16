import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { TokenService } from './token.service'
import { TokenController } from './token.controller'
import { AuthorizationModule } from '@lib/authorization'
import { ConfigModule } from '@nestjs/config'
import jwt from 'config/jwt'
import { ValidateRefreshTokenMiddleware } from '../middlewares/validate-refresh-token.middleware'
import { AdminModule } from '@lib/admin'

@Module({
  imports: [
    AuthorizationModule,
    ConfigModule.forRoot({ load: [jwt] }),
    AdminModule,
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
