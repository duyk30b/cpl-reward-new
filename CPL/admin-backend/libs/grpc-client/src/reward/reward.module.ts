import { getProtoPath } from '@lib/grpc-client'
import grpcClientConfig from '@lib/grpc-client/grpc-client.config'
import { RewardCommonService } from '@lib/grpc-client/reward/reward-common.service'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { RewardService } from './reward.service'

@Module({
  imports: [ConfigModule.forFeature(grpcClientConfig)],
  providers: [
    RewardService,
    RewardCommonService,
    {
      provide: 'CAMPAIGN_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ['admin_campaign', 'admin_common'],
            protoPath: [
              getProtoPath('reward/campaign.proto'),
              getProtoPath('reward/common.proto'),
            ],
            url: configService.get('grpc_client.reward'),
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
  ],
  exports: [RewardService, RewardCommonService],
})
export class RewardModule {}
