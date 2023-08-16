import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import grpcClientConfig from '../../grpc-client.config'
import { getProtoPath } from '../../grpc-client.helper'
import { GrpcCacheManagementService } from './cache-management.service'

@Module({
  imports: [ConfigModule.forFeature(grpcClientConfig)],
  providers: [
    {
      provide: 'BO_CACHE_MANAGEMENT_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ['bo_cache_management'],
            protoPath: [getProtoPath('bo/bo-cache-management.proto')],
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
    GrpcCacheManagementService,
  ],
  exports: [GrpcCacheManagementService],
})
export class GrpcCacheManagementModule {}
