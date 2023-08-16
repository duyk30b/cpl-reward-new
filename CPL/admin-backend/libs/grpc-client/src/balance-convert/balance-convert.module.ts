import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { getProtoPath } from '../grpc-client.helper'
import { BalanceConvertService } from './balance-convert.service'
import { BalanceConvertConstant } from './balance-convert.constant'

@Module({
  providers: [
    {
      provide: BalanceConvertConstant.GRPC_BALANCE_CONVERT_PACKAGE,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ['grpc.setting.v1'],
            protoPath: [getProtoPath('balance-convert-setting.proto')],
            url: configService.get('grpc_client.balance_convert'),
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
    BalanceConvertService,
  ],
  exports: [BalanceConvertService],
})
export class BalanceConvertModule {}
