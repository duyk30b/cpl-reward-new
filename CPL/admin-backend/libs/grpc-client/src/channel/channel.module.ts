import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { getProtoPath } from '..'
import grpcClientConfig from '../grpc-client.config'
import { ChannelService } from './channel.service'

@Module({
  imports: [ConfigModule.forFeature(grpcClientConfig)],
  providers: [
    ChannelService,
    {
      provide: 'CHANNEL_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: 'channel',
            protoPath: getProtoPath('channel.proto'),
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
  ],
  exports: [ChannelService],
})
export class ChannelModule {}
