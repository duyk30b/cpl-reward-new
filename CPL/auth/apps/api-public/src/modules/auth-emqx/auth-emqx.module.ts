import { Module } from '@nestjs/common'
import { AuthorizationModule } from '@lib/authorization'
import { ConfigModule } from '@nestjs/config'
import jwt from 'config/jwt'
import { UserModule } from '@lib/user'
import { AuthEmqxController } from './auth-emqx.controller'
import { AuthEmqxService } from './auth-emqx.service'
import { RedisModule } from '@lib/redis'
import emqx from 'config/emqx'

@Module({
  imports: [
    AuthorizationModule,
    ConfigModule.forRoot({ load: [jwt, emqx] }),
    UserModule,
    RedisModule,
  ],
  controllers: [AuthEmqxController],
  providers: [AuthEmqxService],
})
export class AuthEmqxModule {}
