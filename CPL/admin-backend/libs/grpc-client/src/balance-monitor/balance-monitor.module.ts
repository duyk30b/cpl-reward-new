import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { getProtoPath } from '../grpc-client.helper'
import { GBalanceMonitorService } from './balance-monitor.service'

@Module({
  providers: [
    {
      provide: 'BALANCE_MONITOR_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ['grpc.balance.monitor.v1'],
            protoPath: [getProtoPath('balance-monitor.proto')],
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
    GBalanceMonitorService,
  ],
  exports: [GBalanceMonitorService],
})
export class BalanceMonitorModule {}
