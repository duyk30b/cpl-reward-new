import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { getProtoPath } from '../grpc-client.helper'
import { BalanceTransferHistoryService } from './balance-transfer-history.service'
import { BalanceTransferHistoryConstant } from './balance-transfer-history.constant'

@Module({
  providers: [
    {
      provide:
        BalanceTransferHistoryConstant.GRPC_BALANCE_TRANSFER_HISTORY_PACKAGE,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ['grpc.transfer.v1'],
            protoPath: [getProtoPath('balance-transfer-history.proto')],
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
    BalanceTransferHistoryService,
  ],
  exports: [BalanceTransferHistoryService],
})
export class BalanceTransferHistoryModule {}
