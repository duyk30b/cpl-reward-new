import { getProtoPath } from '@lib/grpc-client'
import grpcClientConfig from '@lib/grpc-client/grpc-client.config'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { ObmBotIdService } from './obm-bot-id.service'

@Module({
  imports: [ConfigModule.forFeature(grpcClientConfig)],
  providers: [
    ObmBotIdService,
    {
      provide: 'OBM_BOT_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ['list_bot_setting'],
            protoPath: [getProtoPath('list-bot-setting.proto')],
            url: configService.get('grpc_client.setting'),
            channelOptions: {
              'grpc.service_config': JSON.stringify({
                loadBalancingConfig: [{ round_robin: {} }],
              }),
            },
            loader: {
              keepCase: true, // enable underscore, field_name do not work without this, must be fieldName
            },
          },
        })
      },
      inject: [ConfigService],
    },
  ],
  exports: [ObmBotIdService],
})
export class ObmBotIdModule {}
