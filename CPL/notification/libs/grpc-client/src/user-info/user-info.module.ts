import { Module } from '@nestjs/common'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { ConfigModule, ConfigService } from '@nestjs/config'
import grpcClientConfig from '../grpc-client.config'
import { getProtoPath } from '../grpc-client.helper'
import { UserInfoService } from './user-info.service'

@Module({
  imports: [ConfigModule.forFeature(grpcClientConfig)],
  providers: [
    {
      provide: 'USER_INFO_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ['user_info'],
            protoPath: [getProtoPath('user_info.proto')],
            url: configService.get('grpc_client.auth'),
          },
        })
      },
      inject: [ConfigService],
    },
    UserInfoService,
  ],
  exports: [UserInfoService],
})
export class UserInfoModule {}
