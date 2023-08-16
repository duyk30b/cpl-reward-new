import { getProtoPath } from '@lib/grpc-client/grpc-client.helper'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { ApiManagementService } from './api-management.service'
import { ApiManagementConstant } from './api-management.constant'

@Module({
  providers: [
    {
      provide: ApiManagementConstant.GRPC_API_MANAGEMENT_TOKEN,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: [ApiManagementConstant.GRPC_API_MANAGEMENT_PACKAGE],
            protoPath: [getProtoPath('api-management/api-management.v1.proto')],
            url: configService.get('grpc_client.api_management'),
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
    ApiManagementService,
  ],
  exports: [ApiManagementService],
})
export class ApiManagementModule {}
