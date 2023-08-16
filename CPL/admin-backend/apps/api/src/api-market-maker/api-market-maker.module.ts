import { MarketMakerModule } from '@app/market-maker'
import { UtilModule } from '@lib/util'
import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AbilityModule } from '../ability/ability.module'
import { ApiMarketMakerOrderService } from './api-market-maker-internal-order.service'
import { ApiMarketMakerController } from './api-market-maker.controller'
import { ApiMarketMakerService } from './api-market-maker-data-point.service'
import configuration from './configuration'
import { ApiMarketMakerExternalOrderService } from './api-market-maker-external-order.service'
import { MarketMakerSettingModule } from '@lib/grpc-client/market-maker-setting'
import { MarketMakerSettingV2Module } from '@lib/grpc-client/market-maker-setting-v2'
import { ExchangeModule } from '@lib/grpc-client/exchange/exchange.module'
import { ApiMarketMakerBCEOrderService } from './api-market-maker-bce-order.service'
import { MarketMakerDataPointModule } from '@lib/grpc-client/market-maker-data-point'
import { GrpcMarketMakerService } from './api-market-maker-data-point-v2.service'

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration] }),
    AbilityModule,
    MarketMakerModule,
    MarketMakerSettingModule,
    MarketMakerSettingV2Module,
    ExchangeModule,
    UtilModule,
    HttpModule,
    MarketMakerDataPointModule,
  ],
  controllers: [ApiMarketMakerController],
  providers: [
    ApiMarketMakerService,
    ApiMarketMakerOrderService,
    ApiMarketMakerExternalOrderService,
    ApiMarketMakerBCEOrderService,
    GrpcMarketMakerService,
  ],
})
export class ApiMarketMakerModule {}
