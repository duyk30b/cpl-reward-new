import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import grpcClientConfig from '../../grpc-client.config'
import { getProtoPath } from '../../grpc-client.helper'
import { GrpcUserGrantPayoutService } from './user-grant-payout.service'

@Module({
  imports: [ConfigModule.forFeature(grpcClientConfig)],
  providers: [
    {
      provide: 'BO_USER_GRANT_PAYOUT_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ['bo_user_grant_payout'],
            protoPath: [getProtoPath('bo/bo-user-grant-payout.proto')],
            url: configService.get('grpc_client.bo'),
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
    GrpcUserGrantPayoutService,
  ],
  exports: [GrpcUserGrantPayoutService],
})
export class GrpcUserGrantPayoutModule {}
