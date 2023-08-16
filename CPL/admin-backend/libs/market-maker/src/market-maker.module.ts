import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DataPointItem } from './data-point.entity'
import { MarketMakerSettingItem } from './market-maker-setting.entity'
import { MarketMakerSettingService } from './market-maker-settings.service'
import { MarketMakerService } from './market-maker.service'

@Module({
  imports: [TypeOrmModule.forFeature([DataPointItem, MarketMakerSettingItem])],
  providers: [MarketMakerService, MarketMakerSettingService],
  exports: [MarketMakerService, MarketMakerSettingService],
})
export class MarketMakerModule {}
