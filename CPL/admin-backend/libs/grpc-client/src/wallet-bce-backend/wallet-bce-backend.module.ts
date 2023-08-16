import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import grpcClientConfig from '../grpc-client.config'
import { getProtoPath } from '@lib/grpc-client'
import { Constants } from './constants'
import { WalletBceBackendService } from './services'

@Module({
  imports: [ConfigModule.forFeature(grpcClientConfig)],
  providers: [
    {
      provide: Constants.GRPC_WALLET_BCE_BACKEND_TOKEN,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ['bce_backend'],
            protoPath: [
              getProtoPath('wallet-bce-backend/bce-backend.v1.proto'),
            ],
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
    WalletBceBackendService,
  ],
  exports: [WalletBceBackendService],
})
export class WalletBceBackendModule {}
