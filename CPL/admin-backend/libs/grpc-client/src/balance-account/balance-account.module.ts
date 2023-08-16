import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { getProtoPath } from '../grpc-client.helper'
import { BalanceAccountService } from './balance-account.service'

@Module({
  providers: [
    {
      provide: 'BALANCE_ACCOUNT_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ['grpc.balance.account.v1'],
            protoPath: [getProtoPath('balance-account.proto')],
            url: configService.get('grpc_client.balance'),
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
    BalanceAccountService,
  ],
  exports: [BalanceAccountService],
})
export class BalanceAccountModule {}
