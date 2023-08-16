import { getProtoPath } from '@lib/grpc-client'
import grpcClientConfig from '@lib/grpc-client/grpc-client.config'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { ObmSettingService } from './obm-setting.service'

@Module({
  imports: [ConfigModule.forFeature(grpcClientConfig)],
  providers: [
    ObmSettingService,
    {
      provide: 'OBM_SETTING_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ['obm_v2'],
            protoPath: [getProtoPath('obm-setting.proto')],
            url: configService.get('grpc_client.setting'),
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
  exports: [ObmSettingService],
})
export class ObmSettingModule {}
