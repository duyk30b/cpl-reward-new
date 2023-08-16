import { getProtoPath } from '@lib/grpc-client'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import grpcClientConfig from '../grpc-client.config'
import { EmailChangeHistoryService } from './email-change-history.service'

@Module({
  imports: [ConfigModule.forFeature(grpcClientConfig)],
  providers: [
    {
      provide: 'EMAIL_CHANGE_HISTORY',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ['email_change_history'],
            protoPath: [getProtoPath('email_change_history.proto')],
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
    EmailChangeHistoryService,
  ],
  exports: [EmailChangeHistoryService],
})
export class EmailChangeHistoryModule {}
