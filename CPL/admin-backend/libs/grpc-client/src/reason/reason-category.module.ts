import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { getProtoPath } from '..'
import grpcClientConfig from '../grpc-client.config'
import { ReasonCategoryService } from '@lib/grpc-client/reason/reason-category.service'

@Module({
  imports: [ConfigModule.forFeature(grpcClientConfig)],
  providers: [
    ReasonCategoryService,
    {
      provide: 'REASON_CATEGORY_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: 'reason_category',
            protoPath: getProtoPath('reason_category.proto'),
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
  exports: [ReasonCategoryService],
})
export class ReasonCategoryModule {}
