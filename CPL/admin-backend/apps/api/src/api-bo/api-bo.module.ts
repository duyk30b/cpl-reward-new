import { Module } from '@nestjs/common'
import { SettingModule } from './setting/setting.module'
import { UnlimitedUserModule } from './unlimited-user/unlimited-user.module'
import { UserTradingModule } from './user-trading/user-trading.module'
import { UserBalanceModule } from './user-balance/user-balance.module'
import { PairPriceModule } from './pair-price/pair-price.module'
import { NewsModule } from './news/news.module'
import { TradingPairModule } from './trading-pair/trading-pair.module'
import { WinningRateModule } from './winning-rate/winning-rate.module'
import { CrawlSettingModule } from './crawl-setting/crawl-setting.module'
import { PairSettingModule } from './pair-setting/pair-setting.module'
import { TradingModeModule } from './trading-mode/trading-mode.module'
import { BlockUserModule } from './block-user/block-user.module'
import { BOSwapsModule } from './swaps/swaps.module'
import { UserGrantPayoutModule } from './user-grant-payout/user-grant-payout.module'
import { LeaderBoardModule } from './leader-board/leader-board.module'

@Module({
  imports: [
    UserTradingModule,
    UnlimitedUserModule,
    BlockUserModule,
    UserBalanceModule,
    SettingModule,
    CrawlSettingModule,
    PairSettingModule,
    PairPriceModule,
    NewsModule,
    TradingPairModule,
    TradingModeModule,
    WinningRateModule,
    BOSwapsModule,
    UserGrantPayoutModule,
    LeaderBoardModule,
  ],
  controllers: [],
  providers: [],
})
export class ApiBOModule {}
