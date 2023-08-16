import { KycType } from '@/models/user/UserKyc'
import { Getters } from '@/store/enums/StoreEnums'

const DocMenuConfig = [
  {
    pages: [
      {
        sectionTitle: 'users',
        route: '/user',
        svgIcon: 'media/icons/duotune/finance/fin006.svg',
        fontIcon: 'bi-printer',
        sub: [
          {
            heading: 'menu.basicInfo',
            route: '/user/basic-info',
          },
          {
            heading: 'menu.listAccountLv',
            route: '/user/list-account-lv',
          },
          {
            heading: `menu.needToApprove.${KycType.PERSONAL}`,
            route: `/user-kyc/need-to-approve/${KycType.PERSONAL}`,
          },
          {
            heading: `menu.needToApprove.${KycType.ENTERPRISE}`,
            route: `/user-kyc/need-to-approve/${KycType.ENTERPRISE}`,
          },
          {
            heading: 'menu.importListToBan',
            route: '/user/import-list-to-ban',
          },
          {
            heading: 'menu.balanceAbnormalList',
            route: '/balance/abnormal-list',
          },
        ],
      },
      {
        sectionTitle: 'menu.reasonManagement',
        route: '/marketing',
        svgIcon: 'media/icons/duotune/ecommerce/ecm002.svg',
        fontIcon: 'bi-cart',
        sub: [
          {
            heading: 'menu.reasonCategory',
            route: '/reason-management/reason-category',
          },
          {
            heading: 'menu.reason',
            route: '/reason-management/reason',
          },
        ],
      },
      {
        sectionTitle: 'menu.marketingFunctions',
        route: '/marketing',
        svgIcon: 'media/icons/duotune/ecommerce/ecm002.svg',
        fontIcon: 'bi-cart',
        sub: [
          {
            heading: 'campaignList',
            route: '/campaign/list',
          },
          // {
          //   heading: 'campaignList-new',
          //   route: '/campaign/list-new',
          // },
          {
            heading: 'menu.userTag',
            route: '/user-tag/list',
          },
          {
            heading: 'menu.registrationChannel',
            route: '/registration-channel/list',
          },
          {
            heading: 'menu.missingRewards',
            route: '/missing-rewards/list',
            notification: Getters.GET_MISSING_REWARDS_COUNT,
          },
        ],
      },
      {
        sectionTitle: 'menu.walletSetting',
        route: '/wallet-setting',
        svgIcon: 'media/icons/duotune/ecommerce/ecm002.svg',
        fontIcon: 'bi-wallet',
        sub: [
          {
            heading: 'menu.walletSettingSub.depositSetting',
            route: '/wallet-setting/deposit-setting',
          },
          {
            heading: 'menu.walletSettingSub.autoWithdrawSetting',
            route: '/wallet-setting/auto-withdraw-setting',
          },
          {
            heading: 'menu.walletSettingSub.motherWalletSetting',
            route: '/wallet-setting/mother-wallet-setting',
          },
          // {
          //   heading: 'menu.walletSettingSub.blacklist',
          //   route: '/wallet-setting/blacklist',
          // },
          {
            heading: 'menu.walletSettingSub.blacklistAddress',
            route: '/wallet-setting/blacklist-address',
          },
          {
            heading: 'menu.walletSettingSub.blacklistUser',
            route: '/wallet-setting/blacklist-user',
          },
          {
            heading: 'menu.walletSettingSub.globalWithdrawal',
            route: '/wallet-setting/withdrawal/global-withdrawal',
          },
          {
            heading: 'menu.walletSettingSub.convertSmallBalance',
            route: '/wallet-setting/convert-small-balance',
          },
          {
            heading: 'menu.walletSettingSub.swapSetting',
            route: '/wallet-setting/swap-setting',
          },
        ],
      },
      {
        sectionTitle: 'menu.wallet',
        route: '/wallet',
        svgIcon: 'media/icons/duotune/ecommerce/ecm002.svg',
        fontIcon: 'bi-wallet',
        sub: [
          {
            sectionTitle: 'menu.walletSub.history.index',
            route: '/wallet/history',
            sub: [
              {
                heading: 'menu.walletSub.history.depositHistory',
                route: '/wallet/history/deposit-history',
              },
              {
                heading: 'menu.walletSub.history.withdrawHistory',
                route: '/wallet/history/withdraw-history',
              },
              {
                heading: 'menu.walletSub.history.convertSmallBalance',
                route: '/wallet/history/convert-small-balance',
              },
              {
                heading: 'menu.walletSub.history.transferHistory',
                route: '/wallet/history/transfer-history',
              },
              {
                heading: 'menu.walletSub.history.swapHistory',
                route: '/wallet/history/swap-history',
              },
            ],
          },
          {
            sectionTitle: 'menu.walletSub.walletService.index',
            route: '/wallet/wallet-service',
            sub: [
              {
                heading: 'menu.walletSub.walletService.depositTransaction',
                route: '/wallet/deposit-transaction',
              },
              {
                heading: 'menu.walletSub.walletService.withdrawTransaction',
                route: '/wallet/withdraw-transaction',
              },
              {
                heading: 'menu.walletSub.walletService.motherWalletList',
                route: '/wallet/mother-wallet-list',
              },
              {
                heading: 'menu.walletSub.walletService.userWalletList',
                route: '/wallet/user-wallet-list',
              },
              {
                heading:
                  'menu.walletSub.walletService.depositIncidentCollection',
                route: '/wallet/deposit-incident-collection',
              },
              {
                heading:
                  'menu.walletSub.walletService.motherWalletIncidentCollection',
                route: '/wallet/mother-wallet-incident-collection',
              },
            ],
          },
          {
            sectionTitle: 'menu.walletSub.withdrawalControl.index',
            route: '/wallet/withdrawal-control',
            sub: [
              {
                heading: 'menu.walletSub.withdrawalControl.userNotConfirmed',
                route: '/wallet/withdrawal-control/user-not-confirmed',
              },
              {
                heading: 'menu.walletSub.withdrawalControl.userCanceled',
                route: '/wallet/withdrawal-control/user-canceled',
              },
              {
                heading: 'menu.walletSub.withdrawalControl.approvalPending',
                route: '/wallet/withdrawal-control/approval-pending',
              },
              {
                heading:
                  'menu.walletSub.withdrawalControl.approvedTransactions',
                route: '/wallet/withdrawal-control/approved-transactions',
              },
              {
                heading:
                  'menu.walletSub.withdrawalControl.remittedTransactions',
                route: '/wallet/withdrawal-control/remitted-transactions',
              },
              {
                heading:
                  'menu.walletSub.withdrawalControl.rejectedTransactions',
                route: '/wallet/withdrawal-control/rejected-transactions',
              },
            ],
          },
        ],
      },
      {
        sectionTitle: 'menu.importExcel',
        route: '/import-excel',
        svgIcon: 'media/icons/duotune/ecommerce/ecm002.svg',
        fontIcon: 'bi-cart',
        sub: [
          {
            heading: 'menu.importExcelSub.importBalance',
            route: '/import-excel/balance',
          },
          {
            heading: 'menu.importExcelSub.importBalanceSetting',
            route: '/import-excel/balance/setting',
          },
        ],
      },
      {
        sectionTitle: 'menu.exchange',
        route: '/exchange',
        svgIcon: 'media/icons/duotune/coding/cod001.svg',
        fontIcon: 'bi-gear',
        sub: [
          {
            heading: 'menu.openOrder',
            route: '/exchange/open-order',
          },
          {
            heading: 'menu.orderHistory',
            route: '/exchange/order-history',
          },
          {
            heading: 'menu.tradeHistory',
            route: '/exchange/trading-history',
          },
        ],
      },
      {
        sectionTitle: 'menu.settings',
        route: '/setting',
        svgIcon: 'media/icons/duotune/coding/cod001.svg',
        fontIcon: 'bi-gear',
        sub: [
          {
            heading: 'menu.currencySetting',
            route: '/currency/setting',
          },
          // {
          //   heading: 'menu.currencyDown',
          //   route: '/currency/down',
          // },
          {
            heading: 'menu.tradingSetting',
            route: '/setting/trading',
          },
          {
            heading: 'menu.categorySetting',
            route: '/setting/coin-category',
          },
          {
            heading: 'menu.unlimitedUser',
            route: '/setting/unlimited-user',
          },
          {
            heading: 'menu.zeroFeeUser',
            route: '/setting/zero-fee-user',
          },
          {
            heading: 'menu.blacklistUser',
            route: '/setting/blacklist-user',
          },
          {
            heading: 'menu.botUser',
            route: '/setting/bot-user',
          },
        ],
      },
      {
        sectionTitle: 'menu.spotGrid',
        route: '/spot-grid',
        svgIcon: 'media/icons/duotune/coding/cod001.svg',
        fontIcon: 'bi-gear',
        sub: [
          {
            heading: 'menu.spotGrid',
            route: '/spot-grid/grid',
          },
          {
            heading: 'menu.tradingPair',
            route: '/spot-grid/trading-pair',
          },
        ],
      },
      {
        sectionTitle: 'menu.notification',
        route: '/notification',
        svgIcon: 'media/icons/duotune/coding/cod001.svg',
        fontIcon: 'bi-gear',
        sub: [
          {
            heading: 'menu.groupNotification',
            route: '/notification/group-notification',
          },
          {
            heading: 'menu.systemPushNotificationSetting',
            route: '/notification/system-push',
          },
        ],
      },
      {
        sectionTitle: 'menu.settingsObm',
        route: '/setting-obm',
        svgIcon: 'media/icons/duotune/coding/cod001.svg',
        fontIcon: 'bi-gear',
        sub: [
          {
            heading: 'menu.generalSetting',
            route: '/setting-obm/general',
          },
          {
            heading: 'menu.systemTargetSetting',
            route: '/setting-obm/system-target',
          },
          {
            heading: 'menu.balanceMonitor',
            route: '/setting-obm/balance-monitor',
          },
          {
            heading: 'menu.commonOBM',
            route: '/setting-obm/common',
          },
          // {
          //   heading: 'menu.thresholdSetting',
          //   route: '/setting-obm/threshold',
          // },
        ],
      },
      {
        sectionTitle: 'menu.monitorObm',
        route: '/obm-monitor',
        svgIcon: 'media/icons/duotune/coding/cod001.svg',
        fontIcon: 'bi-gear',
        sub: [
          {
            heading: 'menu.obmMonitorCounter',
            route: '/obm-monitor/counter',
          },
        ],
      },
      {
        sectionTitle: 'menu.marketMaker',
        route: '/market-maker',
        svgIcon: 'media/icons/duotune/coding/cod001.svg',
        fontIcon: 'bi-gear',
        sub: [
          {
            heading: 'menu.generateData',
            route: '/market-maker/generate-data',
          },
          {
            heading: 'menu.importOrderbook',
            route: '/market-maker/manage-order',
          },
          {
            heading: 'menu.marketMakerSettings',
            route: '/market-maker/settings',
          },
          {
            heading: 'menu.generateDataV2',
            route: '/market-maker/generate-data-v2',
          },
          {
            heading: 'menu.marketMakerSystemTarget',
            route: '/market-maker/system-target',
          },
          {
            heading: 'menu.marketMakerManagePair',
            route: '/market-maker/manage-pair',
          },
        ],
      },
      {
        sectionTitle: 'menu.app',
        route: '/app',
        svgIcon: 'media/icons/duotune/coding/cod001.svg',
        fontIcon: 'bi-gear',
        sub: [
          {
            heading: 'menu.appVersion',
            route: '/app/version',
          },
        ],
      },
      {
        sectionTitle: 'menu.mt5.mt5',
        route: '/mt5',
        svgIcon: 'media/icons/duotune/finance/fin006.svg',
        fontIcon: 'bi-printer',
        sub: [
          {
            sectionTitle: 'menu.mt5.payment',
            route: '/mt5/payment',
            sub: [
              {
                heading: 'menu.mt5.payin',
                route: '/mt5/payment/payin',
              },
              {
                heading: 'menu.mt5.payout',
                route: '/mt5/payment/payout',
              },
            ],
          },
        ],
      },
      {
        sectionTitle: 'menu.highAndLow',
        route: '/high-low',
        svgIcon: 'media/icons/duotune/finance/fin006.svg',
        fontIcon: 'bi-printer',
        sub: [
          {
            heading: 'menu.leaderBoard',
            route: '/high-low/leader-board',
          },
          {
            heading: 'menu.history',
            route: '/high-low/history',
          },
          {
            heading: 'menu.statistic',
            route: '/high-low/statistic',
          },
          {
            heading: 'menu.suspensionList',
            route: '/high-low/suspension',
          },
          {
            heading: 'menu.userBalance',
            route: '/high-low/user-balance',
          },
          {
            heading: 'menu.unlimitedUser',
            route: '/high-low/unlimited-user',
          },
          {
            heading: 'menu.settingTrading',
            route: '/high-low/setting-trading',
          },
          {
            heading: 'menu.settingTrading',
            route: '/high-low/setting-trading/:id',
          },
          {
            heading: 'menu.userTradingLimit',
            route: '/high-low/user-trading-limit',
          },
          {
            heading: 'menu.winning',
            route: '/high-low/wining-rate-analysis',
          },
          {
            heading: 'highLow.settingCrawler',
            route: '/high-low/setting-crawler',
          },
          {
            heading: 'menu.crawler',
            route: '/high-low/crawler',
          },
          {
            heading: 'menu.settingTransfer',
            route: '/high-low/setting-transfer',
          },
          {
            heading: 'menu.export',
            route: '/high-low/export',
          },
        ],
      },
      // {
      //   sectionTitle: 'customers',
      //   route: '/customers',
      //   svgIcon: 'media/icons/duotune/finance/fin006.svg',
      //   fontIcon: 'bi-printer',
      //   sub: [
      //     {
      //       heading: 'gettingStarted',
      //       route: '/apps/customers/getting-started',
      //     },
      //     {
      //       heading: 'customersListing',
      //       route: '/apps/customers/customers-listing',
      //     },
      //     {
      //       heading: 'customerDetails',
      //       route: '/apps/customers/customer-details',
      //     },
      //   ],
      // },
      // {
      //   heading: 'calendarApp',
      //   route: '/apps/calendar',
      //   svgIcon: 'media/icons/duotune/general/gen014.svg',
      //   fontIcon: 'bi-calendar3-event',
      // },
      // {
      //   sectionTitle: 'chat',
      //   route: '/chat',
      //   svgIcon: 'media/icons/duotune/communication/com012.svg',
      //   fontIcon: 'bi-chat-left',
      //   sub: [
      //     {
      //       heading: 'privateChat',
      //       route: '/apps/chat/private-chat',
      //     },
      //     {
      //       heading: 'groupChat',
      //       route: '/apps/chat/group-chat',
      //     },
      //     {
      //       heading: 'drawerChat',
      //       route: '/apps/chat/drawer-chat',
      //     },
      //   ],
      // },
      {
        sectionTitle: 'menu.history',
        route: '/history',
        svgIcon: 'media/icons/duotune/finance/fin006.svg',
        fontIcon: 'bi-printer',
        sub: [
          {
            heading: 'menu.historySub.login',
            route: '/history/login',
          },
          {
            heading: 'menu.historySub.userBalanceChange',
            route: '/history/history-user-balance',
          },
        ],
      },
      {
        sectionTitle: 'menu.accountsAndPermissions',
        fwIcon: 'fas fa-shield-alt',
        sub: [
          {
            heading: 'menu.accounts',
            route: '/admin',
          },
          {
            heading: 'menu.roles',
            route: '/role',
          },
          {
            heading: 'menu.actionLog',
            route: '/action-log',
          },
        ],
      },
      // {
      //   heading: 'menu.auto_withdraw',
      //   svgIcon: 'media/icons/duotune/finance/fin006.svg',
      //   fontIcon: 'bi-printer',
      //   route: '/auto-withdraw/groups',
      // },
      {
        sectionTitle: 'menu.multiLanguageSetting',
        svgIcon: 'media/icons/duotune/finance/fin006.svg',
        sub: [
          {
            heading: 'menu.listTranslateSetting',
            route: '/language-setting/list',
          },
          {
            heading: 'menu.listLanguageSetting',
            route: '/language-setting/languages',
          },
        ],
      },
      {
        heading: 'menu.apiKeyManagement',
        svgIcon: 'media/icons/duotune/finance/fin006.svg',
        fontIcon: 'bi-printer',
        route: '/api-management/list',
      },
      {
        heading: 'menu.listFileExport',
        svgIcon: 'media/icons/duotune/finance/fin006.svg',
        fontIcon: 'bi-printer',
        route: '/list-file-export',
      },
      // {
      //   sectionTitle: 'menu.globalSetting',
      //   svgIcon: 'media/icons/duotune/coding/cod009.svg',
      //   sub: [
      //     {
      //       heading: 'menu.globalWithdrawSetting',
      //       route: '/global-setting/withdrawal',
      //     },
      //     {
      //       heading: 'menu.globalDepositSetting',
      //       route: '/global-setting/deposit',
      //     },
      //   ],
      // },
      {
        sectionTitle: 'menu.dividend.title',
        svgIcon: 'media/icons/duotune/finance/fin008.svg',
        sub: [
          {
            heading: 'menu.dividend.listScreen',
            route: '/dividend/list',
          },
          {
            heading: 'menu.dividend.codeListScreen',
            route: '/dividend/code-list',
          },
          {
            heading: 'menu.dividend.historyScreen',
            route: '/dividend/history',
          },
          {
            heading: 'menu.dividend.disableUserScreen',
            route: '/dividend/disable-user',
          },
        ],
      },
      {
        sectionTitle: 'menu.futures.title',
        svgIcon: 'media/icons/duotune/finance/fin008.svg',
        sub: [
          {
            heading: 'menu.futures.openOrder',
            route: '/futures/open-order',
            showOnProd: false,
          },
          {
            heading: 'menu.futures.orderHistory',
            route: '/futures/order-history',
            showOnProd: false,
          },
          {
            heading: 'menu.futures.openPosition',
            route: '/futures/open-position',
            showOnProd: false,
          },
        ],
      },
      {
        sectionTitle: 'menu.futuresSetting.title',
        svgIcon: 'media/icons/duotune/finance/fin008.svg',
        sub: [
          {
            heading: 'menu.futuresSetting.user',
            route: '/futures/user',
            showOnProd: false,
          },
          {
            heading: 'menu.futuresSetting.setting',
            route: '/futures/setting',
            showOnProd: false,
          },
        ],
      },
      {
        fwIcon: 'fas fa-money-check-alt',
        heading: 'menu.trezorWallet',
        route: '/trezor-wallet',
      },
    ],
  },
]

export default DocMenuConfig
