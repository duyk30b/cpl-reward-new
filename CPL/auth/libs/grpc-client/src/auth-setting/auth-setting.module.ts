import { Module } from '@nestjs/common'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { ConfigModule, ConfigService } from '@nestjs/config'
import grpcClientConfig from '../grpc-client.config'
import { getProtoPath } from '../grpc-client.helper'
import { AuthSettingService } from './auth-setting.service'

@Module({
  imports: [ConfigModule.forFeature(grpcClientConfig)],
  providers: [
    {
      provide: 'AUTH_SETTING_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ['auth'],
            protoPath: [getProtoPath('auth_setting.proto')],
            url: configService.get('grpc_client.setting'),
          },
        })
      },
      inject: [ConfigService],
    },
    AuthSettingService,
  ],
  exports: [AuthSettingService],
})
export class AuthSettingModule {}
