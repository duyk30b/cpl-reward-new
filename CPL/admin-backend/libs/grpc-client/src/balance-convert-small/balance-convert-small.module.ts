import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { getProtoPath } from '../grpc-client.helper'
import { BalanceConvertSmallService } from './balance-convert-small.service'
import { BalanceConvertSmallConstant } from './balance-convert-small.constant'

@Module({
  providers: [
    {
      provide: BalanceConvertSmallConstant.GRPC_BALANCE_CONVERT_SMALL_PACKAGE,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ['grpc.convert.small.v1'],
            protoPath: [getProtoPath('balance-convert-small.proto')],
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
    BalanceConvertSmallService,
  ],
  exports: [BalanceConvertSmallService],
})
export class BalanceConvertSmallModule {}
