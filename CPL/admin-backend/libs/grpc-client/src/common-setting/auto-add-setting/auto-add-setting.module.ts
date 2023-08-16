import { getProtoPath } from '@lib/grpc-client/grpc-client.helper'
import { UploadFileModule } from '@lib/upload-file'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { CommonSettingConstant } from '../common-setting.constant'
import { AutoAddSettingService } from './auto-add-setting.service'

@Module({
  imports: [UploadFileModule],
  providers: [
    {
      provide: CommonSettingConstant.GRPC_COMMON_SETTING_AUTO_ADD,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: [
              CommonSettingConstant.GRPC_COMMON_SETTING_AUTO_ADD_PACKAGE,
            ],
            protoPath: [getProtoPath('common-setting/auto-add-setting.proto')],
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
    AutoAddSettingService,
  ],
  exports: [AutoAddSettingService],
})
export class AutoAddSettingModule {}
