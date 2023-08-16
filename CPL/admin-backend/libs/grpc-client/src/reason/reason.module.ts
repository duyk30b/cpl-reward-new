import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { getProtoPath } from '..'
import grpcClientConfig from '../grpc-client.config'
import { ReasonService } from '@lib/grpc-client/reason/reason.service'

@Module({
  imports: [ConfigModule.forFeature(grpcClientConfig)],
  providers: [
    ReasonService,
    {
      provide: 'REASON_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: 'reason',
            protoPath: getProtoPath('reason.proto'),
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
  exports: [ReasonService],
})
export class ReasonModule {}
