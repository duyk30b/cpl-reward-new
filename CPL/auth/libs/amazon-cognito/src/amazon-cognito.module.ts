import { Module } from '@nestjs/common'
import { AmazonCognitoService } from './amazon-cognito.service'
import { ConfigModule } from '@nestjs/config'
import cynopsis from '../../../config/cynopsis'
import { RedisModule } from '@lib/redis'

@Module({
  imports: [ConfigModule.forRoot({ load: [cynopsis] }), RedisModule],
  providers: [AmazonCognitoService],
  exports: [AmazonCognitoService],
})
export class AmazonCognitoModule {}
