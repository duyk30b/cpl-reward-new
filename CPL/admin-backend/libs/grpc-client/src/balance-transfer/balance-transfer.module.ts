import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { getProtoPath } from '../grpc-client.helper'
import { GBalanceTransferService } from './balance-transfer.service'

@Module({
  providers: [
    {
      provide: 'BALANCE_TRANSFER_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ['grpc.transfer.v1'],
            protoPath: [getProtoPath('balance-transfer.proto')],
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
    GBalanceTransferService,
  ],
  exports: [GBalanceTransferService],
})
export class BalanceTransferModule {}
