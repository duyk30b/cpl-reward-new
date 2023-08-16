import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import grpcClientConfig from '../grpc-client.config'
import { getProtoPath } from '../grpc-client.helper'
import { Constants } from './constants'
import { WalletBceAdminService } from './services'

@Module({
  imports: [ConfigModule.forFeature(grpcClientConfig)],
  providers: [
    {
      provide: Constants.GRPC_WALLET_BCE_ADMIN_TOKEN,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ['bce_admin'],
            protoPath: [getProtoPath('wallet-bce-admin/bce-admin.v1.proto')],
            url: configService.get('grpc_client.hot_wallet'),
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
    WalletBceAdminService,
  ],
  exports: [WalletBceAdminService],
})
export class WalletBceAdminModule {}
