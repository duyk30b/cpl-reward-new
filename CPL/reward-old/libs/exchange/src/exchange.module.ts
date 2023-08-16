import { Module } from '@nestjs/common'
import { ExchangeService } from './exchange.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { join } from 'path'
import configuration from './configuration'
import { ExchangePriceService } from 'libs/exchange/grpc-services/price/exchange-price.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  providers: [
    ExchangeService,
    {
      provide: 'EXCHANGE_GRPC',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            url: configService.get('exchange.grpc_url'),
            package: ['price.v1.orderbook'],
            protoPath: [
              join(process.cwd(), 'libs/exchange/src/proto/price.v1.proto'),
            ],
          },
        })
      },
      inject: [ConfigService],
    },
    ExchangePriceService,
  ],
  exports: [ExchangeService, ExchangePriceService],
})
export class ExchangeModule {}
