import { getProtoPath } from '@lib/grpc-client/grpc-client.helper'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { CommonSettingConstant } from '../common-setting.constant'
import { LanguageSettingService } from './language-setting.service'

@Module({
  providers: [
    {
      provide: CommonSettingConstant.GRPC_LANGUAGE_SETTING_TOKEN,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: [CommonSettingConstant.GRPC_LANGUAGE_SETTING_PACKAGE],
            protoPath: [
              getProtoPath('common-setting/language-setting.v1.proto'),
            ],
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
    LanguageSettingService,
  ],
  exports: [LanguageSettingService],
})
export class LanguageSettingModule {}
