import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ApiAuthModule } from './api-auth/api-auth.module'
import { ApiCampaignModule } from './api-campaign/api-campaign.module'

import { MysqlModule } from '@app/mysql'
import { AdminModule } from '@lib/admin'
import { AuthorizationModule } from '@lib/authorization'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { EventEmitterModule } from '@nestjs/event-emitter'
import global from 'config/global'
import { LogModule } from 'libs/log/src'
import { RolePermissionModule } from 'libs/role-permission/src/role-permission.module'
import { AbilityModule } from './ability/ability.module'
import { ApiAdminModule } from './api-admin/api-admin.module'
import { ApiAppVersionModule } from './api-app-version/api-app-version.module'
import { ApiAutoAddSettingModule } from './api-auto-add-setting/api-auto-add-setting.module'
import { ApiWithdrawModule } from './api-auto-withdraw/api-auto-withdraw.module'
import { ApiBalanceConvertSmallModule } from './api-balance-convert-small/api-balance-convert-small.module'
import { ApiBalanceConvertModule } from './api-balance-convert/api-balance-convert.module'
import { ApiBalanceSwapHistoryModule } from './api-balance-swap-history/api-balance-swap-history.module'
import { ApiBalanceTransferHistoryModule } from './api-balance-transfer-history/api-balance-transfer-history.module'
import { ApiBalanceModule } from './api-balance/api-balance.module'
import { ApiBOModule } from './api-bo/api-bo.module'
import { ApiChannelModule } from './api-channel/api-channel.module'
import { ApiCoinModule } from './api-coin/api-coin.module'
import { ApiDividendModule } from './api-dividend/api-dividend.module'
import { ApiExchangeSettingModule } from './api-exchange-setting/api-exchange-setting.module'
import { ApiExchangeModule } from './api-exchange/api-exchange.module'
import { ApiFuturesModule } from './api-futures/api-futures.module'
import { ApiGridTradingSettingModule } from './api-grid-trading-setting/api-grid-trading-setting.module'
import { ApiGridTradingModule } from './api-grid-trading/api-grid-trading.module'
import { ApiHealthModule } from './api-health/api-health.module'
import { ApiHistoryModule } from './api-history/api-history.module'
import { ApiHotWalletModule } from './api-hot-wallet/api-hot-wallet.module'
import { ApiImportExcelModule } from './api-import-excel/api-import-excel.module'
import { ApiKeyManagementModule } from './api-key-management/api-key-management.module'
import { ApiLanguageModule } from './api-language/api-language.module'
import { ApiLogModule } from './api-log/api-log.module'
import { ApiMarketMakerModule } from './api-market-maker/api-market-maker.module'
import { ApiMissionModule } from './api-mission/api-mission.module'
import { MT5PaymentModule } from './api-mt5/payment/payment.module'
import { ApiNotificationCategoryModule } from './api-notification-category/api-notification-category.module'
import { ApiNotificationModule } from './api-notification/api-notification.module'
import { ApiObmBotModule } from './api-obm-bot/api-obm-bot.module'
import { ApiObmSettingModule } from './api-obm-setting/api-obm-setting.module'
import { ApiReasonModule } from './api-reason/api-reason.module'
import { ApiRejectionReasonModule } from './api-rejection-reason/api-rejection-reason.module'
import { ApiRewardLogModule } from './api-reward-log/api-reward-log.module'
import { ApiSettingModule } from './api-setting/api-setting.module'
import { ApiSystemPushSettingModule } from './api-system-push-setting/api-system-push-setting.module'
import { ApiTagModule } from './api-tag/api-tag.module'
import { TokenModule } from './api-token/token.module'
import { ApiUserInfoModule } from './api-user-info/api-user-info.module'
import { ApiUserKycModule } from './api-user-kyc/api-user-kyc.module'
import { ApiUserNoteModule } from './api-user-note/api-user-note.module'
import { ApiUserRolePermissionModule } from './api-user-role-permission/api-user-role-permission.module'
import { ApiUserTagModule } from './api-user-tag/api-user-tag.module'
import { ApiUserModule } from './api-user/api-user.module'
import { ApiWalletBceAdminModule } from './api-wallet-bce-admin/api-wallet-bce-admin.module'
import { ValidateAccessTokenMiddleware } from './middlewares/validate-access-token.middleware'

@Module({
  imports: [
    ApiCampaignModule,
    ApiAuthModule,
    TokenModule,
    ConfigModule.forRoot({ load: [global] }),
    EventEmitterModule.forRoot(),
    MysqlModule,
    AdminModule,
    RolePermissionModule,
    AbilityModule,
    ApiUserModule,
    AuthorizationModule,
    ApiUserKycModule,
    ApiUserInfoModule,
    ApiChannelModule,
    ApiTagModule,
    ApiUserTagModule,
    ApiRejectionReasonModule,
    ApiMissionModule,
    ApiSettingModule,
    ApiObmSettingModule,
    ApiUserRolePermissionModule,
    ApiExchangeSettingModule,
    ApiRewardLogModule,
    ApiCoinModule,
    ApiHotWalletModule,
    ApiWithdrawModule,
    ApiAppVersionModule,
    ApiHistoryModule,
    ApiAdminModule,
    LogModule,
    ApiLogModule,
    ApiBOModule,
    ApiExchangeModule,
    ApiSystemPushSettingModule,
    ApiBalanceModule,
    ApiLanguageModule,
    ApiMarketMakerModule,
    ApiAutoAddSettingModule,
    ApiImportExcelModule,
    ApiObmBotModule,
    ApiKeyManagementModule,
    ApiWalletBceAdminModule,
    ApiNotificationModule,
    ApiNotificationCategoryModule,
    ApiDividendModule,
    ApiUserNoteModule,
    ApiHealthModule,
    ApiGridTradingSettingModule,
    ApiBalanceConvertModule,
    ApiFuturesModule,
    MT5PaymentModule,
    ApiBalanceConvertSmallModule,
    ApiBalanceTransferHistoryModule,
    ApiBalanceSwapHistoryModule,
    ApiReasonModule,
    ApiGridTradingModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
  controllers: [],
})
export class ApiModule implements NestModule {
  async configure(consumer: MiddlewareConsumer) {
    await consumer
      .apply(ValidateAccessTokenMiddleware)
      .exclude(
        '/auth/login',
        '/auth/login-verify',
        '/token',
        '/market-maker/data-points',
        '/market-maker/settings',
        '/health',
      )
      .forRoutes('*')
  }
}
