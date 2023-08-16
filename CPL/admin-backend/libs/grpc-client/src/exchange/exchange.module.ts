import { AdminModule } from '@lib/admin'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { BotSettingModule } from '../common-setting/bot-setting/bot-setting.module'
import grpcClientConfig from '../grpc-client.config'
import { getProtoPath } from '../grpc-client.helper'
import { UserModule } from '../user'
import { Constants } from './constants'
import { ExchangeUserBlackListService } from './services/exchange-black-list.service'
import { ExchangeOrderService } from './services/exchange-order.service'
import { ExchangeUserUnlimitedService } from './services/exchange-user-unlimited.service'
import { ExchangeUserZeroFeeService } from './services/exchange-user-zero-fee.service'

@Module({
  imports: [
    ConfigModule.forFeature(grpcClientConfig),
    UserModule,
    BotSettingModule,
    AdminModule,
  ],
  providers: [
    {
      provide: Constants.GRPC_EX_ORDER_TOKEN,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: [Constants.GRPC_EX_ORDER_PACKAGE],
            protoPath: [getProtoPath('exchange/exchange.order.admin.v1.proto')],
            url: configService.get('grpc_client.exchange'),
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
    {
      provide: Constants.GRPC_EX_BLACK_LIST_TOKEN,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: [Constants.GRPC_EX_BLACK_LIST_PACKAGE],
            protoPath: [getProtoPath('exchange/blacklist.v1.proto')],
            url: configService.get('grpc_client.exchange'),
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
    {
      provide: Constants.GRPC_EX_USER_UNLIMITED_TOKEN,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: [Constants.GRPC_EX_USER_UNLIMITED_PACKAGE],
            protoPath: [getProtoPath('exchange/user.unlimited.v1.proto')],
            url: configService.get('grpc_client.exchange'),
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
    {
      provide: Constants.GRPC_EX_USER_ZERO_FEE_TOKEN,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: [Constants.GRPC_EX_USER_ZERO_FEE_PACKAGE],
            protoPath: [getProtoPath('exchange/user.zero-fee.v1.proto')],
            url: configService.get('grpc_client.exchange'),
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
    {
      provide: Constants.GRPC_EX_ORDERBOOK_TOKEN,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: [Constants.GRPC_EX_ORDERBOOK_PACKAGE],
            protoPath: [getProtoPath('exchange/orderbook.proto')],
            url: configService.get('grpc_client.exchange_orderbook'),
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
    ExchangeOrderService,
    ExchangeUserBlackListService,
    ExchangeUserUnlimitedService,
    ExchangeUserZeroFeeService,
  ],
  exports: [
    ExchangeOrderService,
    ExchangeUserBlackListService,
    ExchangeUserUnlimitedService,
    ExchangeUserZeroFeeService,
  ],
})
export class ExchangeModule {}
