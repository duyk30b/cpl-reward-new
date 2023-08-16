import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import grpcClientConfig from '../grpc-client.config'
import { getProtoPath } from '../grpc-client.helper'
import { UserKycService } from './user-kyc.service'

@Module({
  imports: [ConfigModule.forFeature(grpcClientConfig)],
  providers: [
    {
      provide: 'USER_KYC_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ['user_kyc'],
            protoPath: [getProtoPath('user_kyc.proto')],
            url: configService.get('grpc_client.auth'),
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
    UserKycService,
  ],
  exports: [UserKycService],
})
export class UserKycModule {}
