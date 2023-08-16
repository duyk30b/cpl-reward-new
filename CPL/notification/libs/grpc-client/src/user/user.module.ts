import { Module } from '@nestjs/common'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { ConfigModule, ConfigService } from '@nestjs/config'
import grpcClientConfig from '../grpc-client.config'
import { getProtoPath } from '../grpc-client.helper'
import { UserService } from './user.service'

@Module({
  imports: [ConfigModule.forFeature(grpcClientConfig)],
  providers: [
    {
      provide: 'USER_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ['user'],
            protoPath: [getProtoPath('user.proto')],
            url: configService.get('grpc_client.auth'),
          },
        })
      },
      inject: [ConfigService],
    },
    UserService,
  ],
  exports: [UserService],
})
export class UserModule {}
