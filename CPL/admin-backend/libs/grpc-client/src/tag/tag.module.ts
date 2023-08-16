import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { getProtoPath } from '..'
import grpcClientConfig from '../grpc-client.config'
import { TagService } from './tag.service'

@Module({
  imports: [ConfigModule.forFeature(grpcClientConfig)],
  providers: [
    TagService,
    {
      provide: 'TAG_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: 'tag',
            protoPath: getProtoPath('tag.proto'),
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
  exports: [TagService],
})
export class TagModule {}
