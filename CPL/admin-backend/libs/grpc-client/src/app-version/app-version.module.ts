import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import grpcClientConfig from '../grpc-client.config'
import { getProtoPath } from '../grpc-client.helper'
import { AppVersionService } from './app-version.service'
import { Constants } from './constants'

@Module({
  imports: [ConfigModule.forFeature(grpcClientConfig)],
  providers: [
    {
      provide: Constants.GRPC_APP_VERSION_SETTING_TOKEN,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: [Constants.GRPC_APP_VERSION_SETTING_PACKAGE],
            protoPath: [getProtoPath('app-version.v1.proto')],
            url: configService.get('grpc_client.setting'),
            channelOptions: {
              'grpc.service_config': JSON.stringify({
                loadBalancingConfig: [{ round_robin: {} }],
              }),
            },
          },
        })
      },
      inject: [ConfigService],
    },
    AppVersionService,
  ],
  exports: [AppVersionService],
})
export class GrpcAppVersionModule {}
