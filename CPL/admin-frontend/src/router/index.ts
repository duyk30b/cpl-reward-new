import CONFIG from '@/config'
import { checkScreen, hasAllPermissions } from '@/core/helpers/common.helper'
import {
  AuthMiddlewareConst,
  Permission,
  Screen,
} from '@/core/variables/common.enum'
import store from '@/store'
import { Mutations } from '@/store/enums/StoreEnums'
import { ElNotification } from 'element-plus'
import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/dashboard',
    component: () => import('@/layout/Layout.vue'),
    meta: {
      auth: AuthMiddlewareConst.AUTH,
    },
    children: [
      {
        path: '/profile',
        name: 'profile',
        component: () => import('@/views/apps/profile/Profile.vue'),
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/Dashboard.vue'),
      },
      {
        path: '/builder',
        name: 'builder',
        component: () => import('@/views/Builder.vue'),
      },
      {
        path: '/user/basic-info',
        name: 'user.basicInfo',
        component: () => import('@/views/apps/user/BasicInfo.vue'),
        meta: {
          permissions: [Permission.USER_GET_LIST],
          screen: Screen.USER_BASIC_INFO,
        },
      },
      {
        path: '/user/list-account-lv',
        name: 'user.listAccountLv',
        component: () => import('@/views/apps/user/ListAccountLevel.vue'),
        meta: {
          permissions: [Permission.USER_GET_LIST],
          screen: Screen.USER_LIST_ACCOUNT_LV,
        },
      },
      {
        path: '/user/:id/detail/:tab?',
        name: 'user.detail',
        component: () => import('@/views/apps/user/UserDetail.vue'),
        meta: {
          permissions: [Permission.USER_READ],
          // screen: Screen.USER_DETAIL,
        },
      },
      {
        path: '/user/import-list-to-ban',
        name: 'user.importListToBan',
        component: () => import('@/views/apps/user/ImportListToBan.vue'),
        meta: {
          permissions: [Permission.IMPORT_BAN_USER],
          screen: Screen.USER_IMPORT_BAN,
        },
      },
      {
        path: '/balance/abnormal-list',
        name: 'balance.abnormalList',
        component: () => import('@/views/apps/balance/AbnormalList.vue'),
        meta: {
          permissions: [Permission.BALANCE_ABNORMAL_READ],
          screen: Screen.BALANCE_ABNORMAL_LIST,
        },
      },
      {
        path: '/user-kyc/need-to-approve/:kycType',
        name: 'userKyc.needToApprove',
        component: () => import('@/views/apps/user-kyc/NeedToApprove.vue'),
        meta: {
          permissions: [Permission.USER_GET_LIST, Permission.USER_KYC_REVIEW],
          screen: Screen.USER_KYC_NEED_TO_APPROVE,
        },
      },
      {
        path: '/reason-management/reason-category',
        name: 'reasonManagement.reasonCategory',
        component: () =>
          import('@/views/apps/user-kyc/reason/ListReasonCategory.vue'),
        meta: {
          permissions: [Permission.USER_REASON_CATEGORY_GET_LIST],
          screen: Screen.USER_REASON_CATEGORY_SCREEN,
        },
      },
      {
        path: '/reason-management/reason',
        name: 'reasonManagement.reason',
        component: () => import('@/views/apps/user-kyc/reason/ListReason.vue'),
        meta: {
          permissions: [Permission.USER_REASON_GET_LIST],
          screen: Screen.USER_REASON_SCREEN,
        },
      },
      {
        path: '/user-kyc/review-ocr',
        name: 'userKyc.reviewOcr',
        component: () => import('@/views/apps/user-kyc/ReviewOcr.vue'),
        meta: {
          permissions: [
            Permission.USER_KYC_READ,
            Permission.USER_INFO_READ,
            Permission.USER_KYC_REVIEW,
          ],
          // screen: Screen.USER_KYC_REVIEW_OCR,
        },
      },
      {
        path: '/user-kyc/review-risk',
        name: 'userKyc.reviewRisk',
        component: () =>
          import('@/views/apps/user-kyc/review-risk/ReviewRisk.vue'),
        meta: {
          permissions: [
            Permission.USER_KYC_READ,
            Permission.USER_INFO_READ,
            Permission.USER_KYC_REVIEW,
          ],
          // screen: Screen.USER_KYC_REVIEW_RISK,
        },
      },
      {
        path: '/campaign/list-old',
        name: 'marketingFunctions.campaignList',
        component: () => import('@/views/apps/campaign/CampaignList.vue'),
        meta: {
          permissions: [Permission.CAMPAIGN_GET_LIST],
          screen: Screen.CAMPAIGN_LIST,
        },
      },
      {
        path: '/campaign/list',
        name: 'marketingFunctions.campaignList',
        component: () => import('@/views/reward/CampaignList.vue'),
        meta: {
          permissions: [Permission.CAMPAIGN_GET_LIST],
          screen: Screen.CAMPAIGN_LIST,
        },
      },
      {
        path: '/campaign/detail/:id',
        name: 'campaign.detail',
        component: () => import('@/views/apps/campaign/CampaignDetail.vue'),
        meta: {
          permissions: [
            Permission.CAMPAIGN_GET_DISPLAY_CONDITIONS,
            Permission.CAMPAIGN_GET_LIST_KAFKA_EVENTS,
            Permission.CAMPAIGN_GET_LIST_USER_CONDITIONS,
            Permission.CAMPAIGN_GET_LIST_GRANT_TARGETS,
            Permission.CAMPAIGN_READ,
          ],
          // screen: Screen.CAMPAIGN_DETAIL,
        },
      },
      {
        path: '/campaign/detail-new/:id',
        name: 'campaign.detail-new',
        component: () => import('@/views/reward/CampaignDetail.vue'),
        meta: {
          permissions: [
            Permission.CAMPAIGN_GET_DISPLAY_CONDITIONS,
            Permission.CAMPAIGN_GET_LIST_KAFKA_EVENTS,
            Permission.CAMPAIGN_GET_LIST_USER_CONDITIONS,
            Permission.CAMPAIGN_GET_LIST_GRANT_TARGETS,
            Permission.CAMPAIGN_READ,
          ],
          // screen: Screen.CAMPAIGN_DETAIL,
        },
      },
      {
        path: '/user-tag/list',
        name: 'userTag.list',
        component: () => import('@/views/apps/user-tag/ListUserTag.vue'),
        meta: {
          permissions: [Permission.USER_MARKETING_GET_LIST],
          screen: Screen.USER_TAG_LIST,
        },
      },
      {
        path: '/registration-channel/list',
        name: 'channel.list',
        component: () => import('@/views/apps/channels/ChannelList.vue'),
        meta: {
          permissions: [Permission.CHANNEL_GET_LIST],
          screen: Screen.CHANNEL_LIST,
        },
      },
      {
        path: '/missing-rewards/list',
        name: 'campaign.missingReward',
        component: () => import('@/views/apps/campaign/MissingRewards.vue'),
        meta: {
          permissions: [Permission.REWARD_LOG_GET_LIST],
          screen: Screen.MISSING_REWARDS_LIST,
        },
      },

      /**
       * Wallet setting routes
       */
      {
        path: '/wallet-setting/deposit-setting',
        name: 'walletSetting.depositSetting',
        component: () => import('@/views/walletSetting/DepositSetting.vue'),
        meta: {
          category: 'deposit-setting',
          permissions: [
            Permission.WALLET_SETTING_READ,
            Permission.WALLET_SETTING_UPDATE,
            Permission.COIN_GET_LIST,
          ],
          screen: Screen.WALLET_DEPOSIT_SETTING,
        },
      },
      {
        path: '/wallet-setting/auto-withdraw-setting',
        name: 'walletSetting.withdrawSetting',
        component: () =>
          import('@/views/walletSetting/AutoWithdrawSetting.vue'),
        meta: {
          category: 'withdraw-setting',
          permissions: [
            Permission.WALLET_SETTING_READ,
            Permission.WALLET_SETTING_UPDATE,
            Permission.COIN_GET_LIST,
          ],
          screen: Screen.WALLET_WITHDRAW_SETTING,
        },
      },
      {
        path: '/wallet-setting/mother-wallet-setting',
        name: 'walletSetting.motherWalletSetting',
        component: () =>
          import('@/views/walletSetting/MotherWalletSetting.vue'),
        meta: {
          category: 'mother-wallet-setting',
          permissions: [
            Permission.WALLET_SETTING_READ,
            Permission.WALLET_SETTING_UPDATE,
            Permission.COIN_GET_LIST,
          ],
          screen: Screen.WALLET_MOTHER_WALLET_SETTING,
        },
      },
      {
        path: '/wallet-setting/blacklist-address',
        name: 'walletSetting.blacklistAddress',
        component: () => import('@/views/walletSetting/BlacklistAddress.vue'),
        meta: {
          permissions: [
            Permission.WALLET_SETTING_READ,
            Permission.WALLET_SETTING_UPDATE,
          ],
          screen: Screen.WALLET_BLACKLIST,
        },
      },
      {
        path: '/wallet-setting/blacklist-user',
        name: 'walletSetting.blacklistUser',
        component: () => import('@/views/walletSetting/BlacklistUser.vue'),
        meta: {
          permissions: [
            Permission.WALLET_SETTING_READ,
            Permission.WALLET_SETTING_UPDATE,
          ],
          screen: Screen.WALLET_BLACKLIST,
        },
      },
      {
        path: '/wallet-setting/withdrawal/global-withdrawal',
        name: 'walletSetting.globalWithdrawal',
        component: () =>
          import('@/views/apps/settings/withdrawal/GlobalWithdrawal.vue'),
        meta: {
          permissions: [
            Permission.COIN_GET_LIST,
            Permission.WALLET_SETTING_READ,
            Permission.WALLET_SETTING_UPDATE,
          ],
          screen: Screen.SETTING_COIN_CATEGORY,
        },
      },
      {
        path: '/wallet-setting/withdrawal/global-withdrawal/usdt-fee-setting',
        name: 'walletSetting.globalWithdrawal.usdtFeeSetting',
        component: () =>
          import('@/views/apps/settings/withdrawal/UsdtFeeSetting.vue'),
        meta: {
          permissions: [
            Permission.COIN_GET_LIST,
            Permission.WALLET_SETTING_READ,
            Permission.WALLET_SETTING_UPDATE,
          ],
          screen: Screen.SETTING_COIN_CATEGORY,
        },
      },
      {
        path: '/wallet-setting/convert-small-balance',
        name: 'walletSetting.convertSmallBalance',
        component: () =>
          import(
            '@/views/apps/convert-small-balance/screens/ConvertSmallBalance.vue'
          ),
        meta: {
          permissions: [
            Permission.BALANCE_CONVERT_SETTING_GET_LIST,
            Permission.BALANCE_CONVERT_SETTING_CREATE,
            Permission.BALANCE_CONVERT_SETTING_UPDATE,
            Permission.BALANCE_CONVERT_SETTING_DELETE,
          ],
          screen: Screen.CONVERT_SMALL_BALANCE_SCREEN,
        },
      },
      {
        path: '/wallet-setting/swap-setting',
        name: 'walletSetting.swapSetting',
        component: () =>
          import('@/views/apps/swap-setting/screens/SwapSetting.vue'),
        meta: {
          permissions: [
            Permission.BALANCE_CONVERT_SETTING_GET_LIST,
            Permission.BALANCE_CONVERT_SETTING_CREATE,
            Permission.BALANCE_CONVERT_SETTING_UPDATE,
            Permission.BALANCE_CONVERT_SETTING_DELETE,
          ],
          screen: Screen.CONVERT_SMALL_BALANCE_SCREEN,
        },
      },

      /**
       * * Wallet routes
       */
      // BCE transaction list
      {
        path: '/wallet/history/deposit-history',
        name: 'wallet.history.depositHistory',
        component: () =>
          import('@/views/wallet-bce-history/DepositHistory.vue'),
        meta: {
          category: 'deposit',
          permissions: [
            Permission.WALLET_SETTING_READ,
            Permission.COIN_GET_LIST,
          ],
          screen: Screen.WALLET_BCE_DEPOSIT_HISTORY,
        },
      },
      {
        path: '/wallet/history/withdraw-history',
        name: 'wallet.history.withdrawHistory',
        component: () =>
          import('@/views/wallet-bce-history/WithdrawHistory.vue'),
        meta: {
          category: 'withdraw',
          permissions: [
            Permission.WALLET_SETTING_READ,
            Permission.COIN_GET_LIST,
          ],
          screen: Screen.WALLET_BCE_WITHDRAW_HISTORY,
        },
      },
      {
        path: '/wallet/history/convert-small-balance',
        name: 'wallet.history.convertSmallBalance',
        component: () =>
          import(
            '@/views/apps/convert-small-balance/screens/ConvertSmallBalanceHistory.vue'
          ),
        meta: {
          permissions: [Permission.BALANCE_CONVERT_SMALL_HISTORY],
          screen: Screen.CONVERT_SMALL_BALANCE_HISTORY_SCREEN,
        },
      },
      {
        path: '/wallet/history/transfer-history',
        name: 'wallet.history.transferHistory',
        component: () =>
          import(
            '@/views/apps/balance-transfer-history/screens/BalanceTransferHistory.vue'
          ),
        meta: {
          permissions: [Permission.BALANCE_TRANSFER_HISTORY],
          screen: Screen.TRANSFER_HISTORY_SCREEN,
        },
      },
      {
        path: '/wallet/history/swap-history',
        name: 'wallet.history.swapHistory',
        component: () =>
          import('@/views/apps/swap-setting/screens/SwapHistory.vue'),
        meta: {
          permissions: [Permission.BALANCE_SWAP_HISTORY],
          screen: Screen.SWAP_HISTORY_SCREEN,
        },
      },
      // Withdrawal control
      {
        path: '/wallet/withdrawal-control/user-not-confirmed',
        name: 'menu.walletSub.withdrawalControl.userNotConfirmed',
        component: () =>
          import('@/views/wallet/withdrawal-control/UserNotConfirmed.vue'),
        meta: {
          category: 'withdrawal-control',
          permissions: [
            Permission.WALLET_SETTING_READ,
            Permission.WALLET_SETTING_UPDATE,
            Permission.COIN_GET_LIST,
          ],
          screen: Screen.WALLET_WITHDRAWAL_CONTROL_USER_NOT_CONFIRMED,
        },
      },
      {
        path: '/wallet/withdrawal-control/user-canceled',
        name: 'menu.walletSub.withdrawalControl.userCanceled',
        component: () =>
          import('@/views/wallet/withdrawal-control/UserCanceled.vue'),
        meta: {
          category: 'withdrawal-control',
          permissions: [
            Permission.WALLET_SETTING_READ,
            Permission.WALLET_SETTING_UPDATE,
            Permission.COIN_GET_LIST,
          ],
          screen: Screen.WALLET_WITHDRAWAL_CONTROL_USER_CANCELED,
        },
      },
      {
        path: '/wallet/withdrawal-control/approval-pending',
        name: 'menu.walletSub.withdrawalControl.approvalPending',
        component: () =>
          import('@/views/wallet/withdrawal-control/ApprovalPending.vue'),
        meta: {
          category: 'withdrawal-control',
          permissions: [
            Permission.WALLET_SETTING_READ,
            Permission.WALLET_SETTING_UPDATE,
            Permission.COIN_GET_LIST,
          ],
          screen: Screen.WALLET_WITHDRAWAL_CONTROL_USER_NOT_CONFIRMED,
        },
      },
      {
        path: '/wallet/withdrawal-control/approval-pending/:transactionId',
        name: 'menu.walletSub.withdrawalControl.pendingApprovalDetail',
        component: () =>
          import(
            '@/views/wallet/withdrawal-control/TransactionApprovalPendingDetails.vue'
          ),
        meta: {
          category: 'withdrawal-control',
          permissions: [
            Permission.WALLET_SETTING_READ,
            Permission.WALLET_SETTING_UPDATE,
          ],
          screen: Screen.WALLET_WITHDRAWAL_CONTROL_USER_NOT_CONFIRMED,
        },
      },
      {
        path: '/wallet/withdrawal-control/approved-transactions',
        name: 'menu.walletSub.withdrawalControl.approvedTransactions',
        component: () =>
          import('@/views/wallet/withdrawal-control/ApprovedTransactions.vue'),
        meta: {
          category: 'withdrawal-control',
          permissions: [
            Permission.WALLET_SETTING_READ,
            Permission.WALLET_SETTING_UPDATE,
            Permission.COIN_GET_LIST,
          ],
          screen: Screen.WALLET_WITHDRAWAL_CONTROL_USER_NOT_CONFIRMED,
        },
      },
      {
        path: '/wallet/withdrawal-control/approved-transactions/:transactionId',
        name: 'menu.walletSub.withdrawalControl.approvedApprovalDetail',
        component: () =>
          import(
            '@/views/wallet/withdrawal-control/TransactionApprovalApprovedDetails.vue'
          ),
        meta: {
          category: 'withdrawal-control',
          permissions: [
            Permission.WALLET_SETTING_READ,
            Permission.WALLET_SETTING_UPDATE,
          ],
          screen: Screen.WALLET_WITHDRAWAL_CONTROL_USER_NOT_CONFIRMED,
        },
      },
      {
        path: '/wallet/withdrawal-control/remitted-transactions',
        name: 'menu.walletSub.withdrawalControl.remittedTransactions',
        component: () =>
          import('@/views/wallet/withdrawal-control/RemittedTransactions.vue'),
        meta: {
          category: 'withdrawal-control',
          permissions: [
            Permission.WALLET_SETTING_READ,
            Permission.WALLET_SETTING_UPDATE,
            Permission.COIN_GET_LIST,
          ],
          screen: Screen.WALLET_WITHDRAWAL_CONTROL_USER_NOT_CONFIRMED,
        },
      },
      {
        path: '/wallet/withdrawal-control/remitted-transactions/:transactionId',
        name: 'menu.walletSub.withdrawalControl.remittedApprovalDetail',
        component: () =>
          import(
            '@/views/wallet/withdrawal-control/TransactionApprovalRemittedDetails.vue'
          ),
        meta: {
          category: 'withdrawal-control',
          permissions: [
            Permission.WALLET_SETTING_READ,
            Permission.WALLET_SETTING_UPDATE,
          ],
          screen: Screen.WALLET_WITHDRAWAL_CONTROL_USER_NOT_CONFIRMED,
        },
      },
      {
        path: '/wallet/withdrawal-control/rejected-transactions',
        name: 'menu.walletSub.withdrawalControl.rejectedTransactions',
        component: () =>
          import('@/views/wallet/withdrawal-control/RejectedTransactions.vue'),
        meta: {
          category: 'withdrawal-control',
          permissions: [
            Permission.WALLET_SETTING_READ,
            Permission.WALLET_SETTING_UPDATE,
            Permission.COIN_GET_LIST,
          ],
          screen: Screen.WALLET_WITHDRAWAL_CONTROL_USER_NOT_CONFIRMED,
        },
      },
      {
        path: '/wallet/withdrawal-control/rejected-transactions/:transactionId',
        name: 'menu.walletSub.withdrawalControl.rejectedApprovalDetail',
        component: () =>
          import(
            '@/views/wallet/withdrawal-control/TransactionApprovalRejectedDetails.vue'
          ),
        meta: {
          category: 'withdrawal-control',
          permissions: [
            Permission.WALLET_SETTING_READ,
            Permission.WALLET_SETTING_UPDATE,
          ],
          screen: Screen.WALLET_WITHDRAWAL_CONTROL_USER_NOT_CONFIRMED,
        },
      },
      // Wallet service
      {
        path: '/wallet/deposit-transaction',
        name: 'wallet.depositTransaction',
        component: () => import('@/views/wallet/DepositWallet.vue'),
        meta: {
          category: 'deposit',
          permissions: [
            Permission.WALLET_SETTING_READ,
            Permission.WALLET_SETTING_UPDATE,
            Permission.COIN_GET_LIST,
          ],
          screen: Screen.WALLET_DEPOSIT_WALLET_LIST,
        },
      },
      {
        path: '/wallet/withdraw-transaction',
        name: 'wallet.withdrawWalletList',
        component: () => import('@/views/wallet/WalletWithdrawList.vue'),
        meta: {
          category: 'withdraw',
          permissions: [
            Permission.WALLET_SETTING_READ,
            Permission.WALLET_SETTING_UPDATE,
            Permission.COIN_GET_LIST,
          ],
          screen: Screen.WALLET_WITHDRAW_WALLET_LIST,
        },
      },
      {
        path: '/wallet/mother-wallet-list',
        name: 'wallet.motherWalletList',
        component: () => import('@/views/wallet/MotherWalletList.vue'),
        meta: {
          category: 'withdraw',
          permissions: [
            Permission.WALLET_SETTING_READ,
            Permission.WALLET_SETTING_UPDATE,
            Permission.COIN_GET_LIST,
          ],
          screen: Screen.WALLET_MOTHER_WALLET_LIST,
        },
      },
      {
        path: '/wallet/user-wallet-list',
        name: 'wallet.userWalletList',
        component: () => import('@/views/wallet/UserWalletList.vue'),
        meta: {
          permissions: [
            Permission.WALLET_SETTING_READ,
            Permission.WALLET_SETTING_UPDATE,
            Permission.COIN_GET_LIST,
          ],
          screen: Screen.WALLET_MOTHER_WALLET_LIST,
        },
      },
      {
        path: '/wallet/deposit-incident-collection',
        name: 'wallet.depositIncidentCollection',
        component: () => import('@/views/wallet/DepositIncidentCollection.vue'),
        meta: {
          category: 'blacklist',
          permissions: [
            Permission.WALLET_SETTING_READ,
            Permission.WALLET_SETTING_UPDATE,
            Permission.COIN_GET_LIST,
          ],
          screen: Screen.WALLET_DEPOSIT_INCIDENT_COLLECTION,
        },
      },
      {
        path: '/wallet/mother-wallet-incident-collection',
        name: 'wallet.motherWalletIncidentCollection',
        component: () =>
          import('@/views/wallet/MotherWalletIncidentCollection.vue'),
        meta: {
          category: 'mother-wallet',
          permissions: [
            Permission.WALLET_SETTING_READ,
            Permission.WALLET_SETTING_UPDATE,
            Permission.COIN_GET_LIST,
          ],
          screen: Screen.WALLET_MOTHER_WALLET_INCIDENT_COLLECTION,
        },
      },
      {
        path: '/import-excel/balance',
        name: 'importExcel.balance',
        component: () => import('@/views/apps/import-excel/balance/index.vue'),
        meta: {
          category: 'balance',
          permissions: [],
          screen: Screen.IMPORT_EXCEL_BALANCE_LIST,
        },
      },
      {
        path: '/import-excel/balance/setting',
        name: 'importExcel.balance.setting',
        component: () =>
          import('@/views/apps/import-excel/balance/setting.vue'),
        meta: {
          category: 'balance',
          permissions: [],
          screen: Screen.IMPORT_EXCEL_BALANCE_SETTING,
        },
      },
      {
        path: '/exchange/open-order',
        name: 'exchangeHistory.openOrder',
        component: () => import('@/views/apps/exchange-history/OpenOrder.vue'),
        meta: {
          permissions: [Permission.EXCHANGE_ORDER_READ],
          screen: Screen.EXCHANGE_OPEN_ORDER,
        },
      },
      {
        path: '/spot-grid/trading-pair',
        name: 'gridTrading.tradingPair',
        component: () => import('@/views/apps/grid-trading/TradingPair.vue'),
        meta: {
          permissions: [Permission.GRID_TRADING_SETTING_READ],
          screen: Screen.SPOT_GRID_TRADING_SETTING,
        },
      },
      {
        path: '/spot-grid/grid',
        name: 'gridTrading.grid',
        component: () => import('@/views/apps/grid-trading/Grid.vue'),
        meta: {
          permissions: [Permission.GRID_TRADING_READ],
          screen: Screen.SPOT_GRID_TRADING,
        },
      },
      {
        path: '/exchange/order-history',
        name: 'exchangeHistory.orderHistory',
        component: () =>
          import('@/views/apps/exchange-history/OrderHistory.vue'),
        meta: {
          permissions: [Permission.EXCHANGE_ORDER_READ],
          screen: Screen.EXCHANGE_ORDER_HISTORY,
        },
      },
      {
        path: '/exchange/trading-history',
        name: 'exchangeHistory.tradingHistory',
        component: () =>
          import('@/views/apps/exchange-history/TradeHistory.vue'),
        meta: {
          permissions: [Permission.EXCHANGE_ORDER_READ],
          screen: Screen.EXCHANGE_TRADING_HISTORY,
        },
      },
      {
        path: '/setting/trading',
        name: 'setting.trading',
        component: () => import('@/views/apps/settings/TradingSetting.vue'),
        meta: {
          permissions: [
            Permission.PAIR_SETTINGS_READ,
            Permission.AUTO_ADD_SETTING_READ,
          ],
          screen: Screen.SETTING_TRADING,
        },
      },
      {
        path: '/setting/unlimited-user',
        name: 'setting-unlimited-user',
        component: () => import('@/views/apps/settings/UnlimitedUser.vue'),
        meta: {
          permissions: [Permission.EXCHANGE_USER_UNLIMITED_READ],
          screen: Screen.SETTING_UNLIMITED_USER,
        },
      },
      {
        path: '/setting/zero-fee-user',
        name: 'setting-zero-fee-user',
        component: () => import('@/views/apps/settings/ZeroFeeUser.vue'),
        meta: {
          permissions: [Permission.EXCHANGE_USER_ZERO_FEE_READ],
          screen: Screen.EXCHANGE_USER_ZERO_FEE,
        },
      },
      {
        path: '/setting/blacklist-user',
        name: 'blacklistUser',
        component: () => import('@/views/apps/settings/BlacklistUser.vue'),
        meta: {
          permissions: [Permission.EXCHANGE_USER_BLACK_LIST_READ],
          screen: Screen.EXCHANGE_USER_BLACKLIST,
        },
      },
      {
        path: '/setting/bot-user',
        name: 'botUser',
        component: () => import('@/views/apps/settings/BotSetting.vue'),
        meta: {
          permissions: [Permission.OBM_BOT_READ],
          screen: Screen.SETTING_BOT,
        },
      },
      {
        path: '/notification/group-notification',
        name: 'groupNotification.groupNotification',
        component: () =>
          import('@/views/apps/notification/group-notification/index.vue'),
        meta: {
          permissions: [Permission.GLOBAL_NOTIFICATION_READ],
          screen: Screen.GLOBAL_NOTIFICATION_LIST,
        },
      },
      {
        path: '/notification/group-notification/create',
        name: 'groupNotification.create',
        component: () =>
          import('@/views/apps/notification/group-notification/create.vue'),
        meta: {
          permissions: [Permission.GLOBAL_NOTIFICATION_CREATE],
        },
      },
      {
        path: '/notification/group-notification/:id/edit',
        name: 'groupNotification.edit',
        component: () =>
          import('@/views/apps/notification/group-notification/edit.vue'),
        meta: {
          permissions: [Permission.GLOBAL_NOTIFICATION_UPDATE],
        },
      },
      {
        path: '/notification/system-push',
        name: 'notificationSetting.systemPush',
        component: () =>
          import(
            '@/views/apps/notification/system-push-setting/SystemPushSetting.vue'
          ),
        meta: {
          permissions: [Permission.SYSTEM_PUSH_SETTING_READ],
          screen: Screen.SYSTEM_PUSH_SETTING,
        },
      },
      {
        path: '/setting/coin-category',
        name: 'coin.categorySetting',
        component: () =>
          import('@/views/apps/settings/CoinCategorySetting.vue'),
        meta: {
          permissions: [Permission.PAIR_CATEGORY_SETTINGS_READ],
          screen: Screen.SETTING_COIN_CATEGORY,
        },
      },

      {
        path: '/app/version',
        name: 'app.versionSetting',
        component: () => import('@/views/apps/app/AppVersion.vue'),
        meta: {
          permissions: [Permission.APP_VERSION_READ],
          screen: Screen.APP_VERSION_SETTING,
        },
      },
      {
        path: '/setting-obm/general',
        name: 'obmSetting.general',
        component: () => import('@/views/apps/settings-obm/GeneralSetting.vue'),
        meta: {
          permissions: [Permission.OBM_SETTING_READ],
          screen: Screen.OBM_SETTING_GENERAL,
        },
      },
      {
        path: '/setting-obm/system-target',
        name: 'obmSetting.sysTarget',
        component: () =>
          import('@/views/apps/settings-obm/SystemTargetSetting.vue'),
        meta: {
          permissions: [Permission.OBM_SETTING_READ],
          screen: Screen.OBM_SETTING_SYS_TARGET,
        },
      },
      {
        path: '/setting-obm/balance-monitor',
        name: 'obmSetting.balance-monitor',
        component: () => import('@/views/apps/settings-obm/BalanceSetting.vue'),
        meta: {
          permissions: [Permission.OBM_SETTING_READ],
          screen: Screen.OBM_SETTING_BALANCE,
        },
      },
      {
        path: '/setting-obm/threshold',
        name: 'obmSetting.threshold',
        component: () =>
          import('@/views/apps/settings-obm/ThresholdSetting.vue'),
        meta: {
          permissions: [Permission.OBM_SETTING_READ],
          screen: Screen.OBM_SETTING_THRESHOLD,
        },
      },
      {
        path: '/setting-obm/common',
        name: 'obmSetting.common',
        component: () => import('@/views/apps/settings-obm/CommonSetting.vue'),
        meta: {
          permissions: [Permission.OBM_SETTING_READ],
          screen: Screen.OBM_SETTING_GENERAL,
        },
      },
      {
        path: '/market-maker/generate-data',
        name: 'marketMaker.generateData',
        component: () => import('@/views/apps/market-maker/GenerateData.vue'),
        meta: {
          permissions: [Permission.MARKET_MAKER_READ],
          screen: Screen.MARKET_MAKER,
        },
      },
      {
        path: '/market-maker/settings',
        name: 'marketMaker.settings',
        component: () => import('@/views/apps/market-maker/Settings.vue'),
        meta: {
          permissions: [Permission.MARKET_MAKER_READ],
          screen: Screen.MARKET_MAKER,
        },
      },
      {
        path: '/market-maker/generate-data-v2',
        name: 'marketMaker.generateDataV2',
        component: () => import('@/views/apps/market-maker/GenerateDataV2.vue'),
        meta: {
          permissions: [Permission.MARKET_MAKER_READ],
          screen: Screen.MARKET_MAKER,
        },
      },
      {
        path: '/market-maker/system-target',
        name: 'marketMaker.systemTarget',
        component: () =>
          import('@/views/apps/market-maker/SystemTargetSetting.vue'),
        meta: {
          permissions: [Permission.MARKET_MAKER_READ],
          screen: Screen.MARKET_MAKER,
        },
      },
      {
        path: '/market-maker/manage-pair',
        name: 'marketMaker.managePair',
        component: () => import('@/views/apps/market-maker/ManagePair.vue'),
        meta: {
          permissions: [Permission.MARKET_MAKER_READ],
          screen: Screen.MARKET_MAKER,
        },
      },
      {
        path: '/market-maker/manage-order',
        name: 'marketMaker.manageOrder',
        component: () => import('@/views/apps/market-maker/ManageOrder.vue'),
        meta: {
          permissions: [Permission.MARKET_MAKER_MONITOR],
          screen: Screen.MARKET_MAKER,
        },
      },
      {
        path: '/high-low/leader-board',
        name: 'leader-board',
        component: () => import('@/views/apps/high-low/LeaderBoard/index.vue'),
        meta: {
          permissions: [Permission.HIGH_LOW_SETTING_READ],
          screen: Screen.HIGH_LOW_LEADERBOARD,
        },
      },
      {
        path: '/high-low/history',
        name: 'highLow.history',
        component: () => import('@/views/apps/high-low/History/index.vue'),
        meta: {
          permissions: [
            Permission.HIGH_LOW_USER_TRADING_READ,
            Permission.HIGH_LOW_TRADING_MODE_READ,
            Permission.HIGH_LOW_USER_BALANCE_READ,
          ],
          screen: Screen.HIGH_LOW_HISORY,
        },
      },
      {
        path: '/high-low/user-balance',
        name: 'high-low-user-balance',
        component: () => import('@/views/apps/high-low/User/index.vue'),
        meta: {
          permissions: [Permission.HIGH_LOW_USER_BALANCE_READ],
          screen: Screen.HIGH_LOW_USER_BALANCE,
        },
      },
      {
        path: '/high-low/statistic',
        name: 'high-low-statistic',
        component: () => import('@/views/apps/high-low/Statistic/index.vue'),
        meta: {
          permissions: [
            Permission.HIGH_LOW_USER_TRADING_READ,
            Permission.HIGH_LOW_USER_BALANCE_READ,
            Permission.HIGH_LOW_TRADING_PAIR_READ,
            Permission.HIGH_LOW_TRADING_MODE_READ,
          ],
          screen: Screen.HIGH_LOW_STATISTIC,
        },
      },
      {
        path: '/high-low/suspension',
        name: 'high-low-suspension',
        component: () => import('@/views/apps/high-low/Suspension/index.vue'),
        meta: {
          permissions: [
            Permission.HIGH_LOW_USER_TRADING_READ,
            Permission.HIGH_LOW_TRADING_PAIR_READ,
            Permission.HIGH_LOW_TRADING_MODE_READ,
            Permission.HIGH_LOW_BLOCK_USER_CREATE,
            Permission.HIGH_LOW_BLOCK_USER_DELETE,
            Permission.HIGH_LOW_BLOCK_USER_READ,
          ],
          screen: Screen.HIGH_LOW_SUSPENSION,
        },
      },
      {
        path: '/high-low/unlimited-user',
        name: 'high-low-unlimited-user',
        component: () =>
          import('@/views/apps/high-low/UnlimitedUser/index.vue'),
        meta: {
          permissions: [Permission.HIGH_LOW_UNLIMITED_USER_READ],
          screen: Screen.HIGH_LOW_UNLIMITED_USER,
        },
      },
      {
        path: '/high-low/setting-trading',
        name: 'high-low-setting-trading',
        component: () =>
          import('@/views/apps/high-low/SettingTrading/index.vue'),
        meta: {
          permissions: [
            Permission.HIGH_LOW_SETTING_READ,
            Permission.HIGH_LOW_PAIR_SETTING_READ,
            Permission.HIGH_LOW_TRADING_MODE_READ,
            Permission.HIGH_LOW_USER_GRANT_PAYOUT_READ,
          ],
          screen: Screen.HIGH_LOW_SETTING_TRADING,
        },
      },
      {
        path: '/high-low/setting-trading/:id',
        name: 'high-low-setting-trading-detail',
        component: () =>
          import('@/views/apps/high-low/SettingTrading/page/index.vue'),
        meta: {
          permissions: [
            Permission.HIGH_LOW_TRADING_MODE_READ,
            Permission.HIGH_LOW_TRADING_MODE_DELETE,
            Permission.HIGH_LOW_TRADING_MODE_UPDATE,
            Permission.HIGH_LOW_TRADING_MODE_CREATE,
          ],
          // screen: Screen.HIGH_LOW_SETTING_TRADING,
        },
      },
      {
        path: '/high-low/user-trading-limit',
        name: 'high-low-user-trading-limit',
        component: () =>
          import('@/views/apps/high-low/UserTradingLimit/index.vue'),
        meta: {
          permissions: [Permission.HIGH_LOW_USER_TRADING_READ],
          screen: Screen.HIGH_LOW_USER_TRADING_LIMIT,
        },
      },
      {
        path: '/high-low/setting-crawler',
        name: 'high-low-setting-crawler',
        component: () =>
          import('@/views/apps/high-low/SettingCrawler/index.vue'),
        meta: {
          permissions: [Permission.HIGH_LOW_SETTING_READ],
          screen: Screen.HIGH_LOW_SETTING_CRAWLER,
        },
      },
      {
        path: '/high-low/crawler',
        name: 'high-low-crawler',
        component: () => import('@/views/apps/high-low/Crawler/index.vue'),
        meta: {
          permissions: [Permission.HIGH_LOW_PAIR_PRICE_READ],
          screen: Screen.HIGH_LOW_STATISTIC_CRAWLER,
        },
      },
      {
        path: '/high-low/setting-transfer',
        name: 'setting-transfer',
        component: () =>
          import('@/views/apps/high-low/SettingTransfer/SettingTransfer.vue'),
        meta: {
          permissions: [Permission.HIGH_LOW_SETTING_READ],
          screen: Screen.HIGH_LOW_BTC_TRANSFER,
        },
      },
      {
        path: '/high-low/export',
        name: 'high-low-export',
        component: () => import('@/views/apps/high-low/Export/index.vue'),
        meta: {
          permissions: [Permission.HIGH_LOW_USER_BALANCE_READ],
          screen: Screen.HIGH_LOW_EXPORT,
        },
      },
      {
        path: '/mt5/payment/payout',
        name: 'mt5-payment-payout',
        component: () => import('@/views/apps/mt5/Payment/Payout/index.vue'),
        meta: {
          permissions: [Permission.MT5_PAYMENT_ECHELON_PAYOUT_READ],
          screen: Screen.MT5_PAYMENT_PAYOUT,
        },
      },
      {
        path: '/mt5/payment/payin',
        name: 'mt5-payment-payin',
        component: () => import('@/views/apps/mt5/Payment/Payin/index.vue'),
        meta: {
          permissions: [Permission.MT5_PAYMENT_ECHELON_PAYIN_READ],
          screen: Screen.MT5_PAYMENT_PAYIN,
        },
      },
      {
        path: '/history/login',
        name: 'history.login',
        component: () => import('@/views/apps/history/Login.vue'),
        meta: {
          permissions: [Permission.USER_LOGIN_HISTORY_READ],
          screen: Screen.HISTORY_LOGIN,
        },
      },
      {
        path: '/history/history-user-balance',
        name: 'user-balance-change-history',
        component: () =>
          import(
            '@/views/apps/history/user-balance-change-history/UserBalanceChange.vue'
          ),
        meta: {
          permissions: [Permission.USER_BALANCE_CHANGE_HISTORY],
          screen: Screen.USER_BALANCE_CHANGE_HISTORY,
        },
      },
      {
        path: '/admin',
        name: 'admin.list',
        component: () => import('@/views/apps/admin/AdminList.vue'),
        meta: {
          permissions: [Permission.ADMIN_GET_LIST],
          screen: Screen.ADMIN_LIST,
        },
      },
      {
        path: '/admin/:id/permissions',
        name: 'admin.permission',
        component: () => import('@/views/apps/admin/AdminPermission.vue'),
        meta: {
          permissions: [Permission.ADMIN_SET_PERMISSION],
          // screen: Screen.ADMIN_PERMISSION,
        },
      },
      {
        path: '/role',
        name: 'role.list',
        component: () => import('@/views/apps/role/RoleList.vue'),
        meta: {
          permissions: [Permission.ROLE_GET_LIST],
          screen: Screen.ROLE_LIST,
        },
      },
      {
        path: '/role/create',
        name: 'role.create',
        component: () => import('@/views/apps/role/RoleCreate.vue'),
        meta: {
          permissions: [Permission.ROLE_GET_LIST],
          // screen: Screen.ROLE_CREATE,
        },
      },
      {
        path: '/role/:id/update',
        name: 'role.update',
        component: () => import('@/views/apps/role/RoleUpdate.vue'),
        meta: {
          permissions: [Permission.ROLE_GET_LIST],
          // screen: Screen.ROLE_UPDATE,
        },
      },
      {
        path: '/action-log',
        name: 'action-log',
        component: () => import('@/views/apps/admin/AdminActionLog.vue'),
        meta: {
          permissions: [Permission.ADMIN_ACTION_LOG_READ],
          screen: Screen.ADMIN_ACTION_LOG,
        },
      },
      {
        path: '/auto-withdraw/groups',
        name: 'autoWithdraw.groups',
        component: () => import('@/views/auto_withdraw/AutoWithdrawGroups.vue'),
        meta: {
          permissions: [Permission.AUTO_WITHDRAW_GROUP_COMMON],
          screen: Screen.AUTO_WITHDRAW_GROUP,
        },
      },
      {
        path: '/auto-withdraw/groups/:id',
        name: 'autoWithdraw.detail',
        component: () =>
          import('@/views/auto_withdraw/AutoWithdrawGroupDetail.vue'),
        meta: {
          permissions: [Permission.AUTO_WITHDRAW_GROUP_DETAIL],
          screen: Screen.AUTO_WITHDRAW_GROUP,
        },
      },
      {
        path: '/trezor-wallet',
        name: 'trezorWallet',
        component: () =>
          import('@/views/apps/trezor-wallet/TrezorWalletList.vue'),
        meta: {
          permissions: [
            Permission.WALLET_SETTING_READ,
            Permission.WALLET_SETTING_UPDATE,
            Permission.COIN_GET_LIST,
          ],
          screen: Screen.TREZOR_WALLET,
        },
      },
      {
        path: '/currency/setting',
        name: 'currency.setting',
        component: () => import('@/views/currency/CurrencySetting.vue'),
        meta: {
          permissions: [
            Permission.AUTO_ADD_SETTING_UPDATE,
            Permission.AUTO_ADD_SETTING_LIST,
          ],
          screen: Screen.CURRENCY_SETTING,
        },
      },
      {
        path: '/currency/setting/new-currency',
        name: 'currency.setting.new_currency',
        component: () => import('@/views/currency/RegisterNewCurrency.vue'),
        meta: {
          permissions: [Permission.AUTO_ADD_SETTING_CREATE],
          screen: Screen.CURRENCY_SETTING,
        },
      },
      {
        path: 'setting/new-eb20',
        name: 'currency.setting.new_eb20',
        component: () => import('@/views/currency/RegisterNewEB20.vue'),
        meta: {
          permissions: [
            Permission.AUTO_ADD_SETTING_CREATE,
            Permission.AUTO_ADD_SMART_CONTRACT_GET,
          ],
          screen: Screen.CURRENCY_SETTING,
        },
      },
      {
        path: '/currency/down',
        name: 'currency.down',
        component: () => import('@/views/currency/CurrencyDown.vue'),
        meta: {
          permissions: [],
          screen: Screen.CURRENCY_DOWN,
        },
      },
      {
        path: '/language-setting/list',
        name: 'languageSetting.list',
        component: () =>
          import('@/views/apps/language-setting/TranslateSettingList.vue'),
        meta: {
          permissions: [
            Permission.MULTI_LANGUAGE_GET_TRANSLATES,
            Permission.MULTI_LANGUAGE_IMPORT_TRANSLATE,
            Permission.MULTI_LANGUAGE_SET_TRANSLATE,
            Permission.MULTI_LANGUAGE_EXPORT_ALL_TRANSLATE,
          ],
          screen: Screen.TRANSLATE_SETTING_LIST,
        },
      },
      {
        path: '/language-setting/languages',
        name: 'languageSetting.listLanguage',
        component: () =>
          import('@/views/apps/language-setting/LanguageSettingList.vue'),
        meta: {
          permissions: [
            Permission.MULTI_LANGUAGE_LIST_LANGUAGE,
            Permission.MULTI_LANGUAGE_SET_LANGUAGE,
          ],
          screen: Screen.LANGUAGE_SETTING_LIST,
        },
      },
      {
        path: '/global-setting/withdrawal',
        name: 'menu.globalWithdrawSetting',
        component: () => import('@/views/apps/global-setting/Withdrawal.vue'),
        meta: {
          permissions: [],
          screen: Screen.LANGUAGE_SETTING_LIST,
        },
      },
      {
        path: '/global-setting/deposit',
        name: 'menu.globalDepositSetting',
        component: () => import('@/views/apps/global-setting/Deposit.vue'),
        meta: {
          permissions: [],
          screen: Screen.LANGUAGE_SETTING_LIST,
        },
      },
      {
        path: '/api-management/list',
        name: 'apiManagement.list',
        component: () => import('@/views/apps/api-management/List.vue'),
        meta: {
          permissions: [
            Permission.API_MANAGEMENT_LIST,
            Permission.API_MANAGEMENT_DETAIL,
            Permission.API_MANAGEMENT_CHANGE_STATUS,
          ],
          screen: Screen.API_MANAGEMENT_LIST,
        },
      },
      {
        path: '/list-file-export',
        name: 'menu.listFileExport',
        component: () =>
          import('@/views/apps/list-file-export/ListFileExport.vue'),
        meta: {
          permissions: [
            Permission.WALLET_SETTING_READ,
            Permission.WALLET_SETTING_UPDATE,
          ],
          screen: Screen.LIST_FILE_EXPORT,
        },
      },
      {
        path: '/dividend/list',
        name: 'dividend.listScreen',
        component: () => import('@/views/dividend/screens/DividendList.vue'),
        meta: {
          permissions: [
            Permission.DIVIDEND_GET_LIST,
            Permission.DIVIDEND_CANCEL,
            Permission.DIVIDEND_CREATED,
          ],
          screen: Screen.DIVIDEND_LIST,
        },
      },
      {
        path: '/dividend/detail/:id',
        name: 'dividend.detailScreen',
        component: () => import('@/views/dividend/screens/DividendDetail.vue'),
        meta: {
          permissions: [
            Permission.DIVIDEND_GET_DETAIL,
            Permission.DIVIDEND_GET_ADVANCED,
          ],
          // screen: Screen.DIVIDEND_DETAIL,
        },
      },
      {
        path: '/dividend/:id/edit',
        name: 'dividend.editScreen',
        component: () => import('@/views/dividend/screens/DividendEdit.vue'),
        meta: {
          permissions: [
            Permission.DIVIDEND_GET_DETAIL,
            Permission.DIVIDEND_UPDATE,
          ],
          // screen: Screen.DIVIDEND_EDIT,
        },
      },
      {
        path: '/dividend/code-list',
        name: 'dividend.codeListScreen',
        component: () =>
          import('@/views/dividend/screens/DividendCodeList.vue'),
        meta: {
          permissions: [
            Permission.DIVIDEND_GET_CODE_LIST,
            Permission.DIVIDEND_GET_CAMPAIGN_NAME,
            Permission.DIVIDEND_TOOGLE_CODE,
            Permission.DIVIDEND_CREATE_CODE,
          ],
          screen: Screen.DIVIDEND_CODE_LIST,
        },
      },
      {
        path: '/dividend/history',
        name: 'dividend.historyScreen',
        component: () => import('@/views/dividend/screens/DividendHistory.vue'),
        meta: {
          permissions: [
            Permission.DIVIDEND_GET_HISTORY,
            Permission.DIVIDEND_GET_CAMPAIGN_NAME,
          ],
          screen: Screen.DIVIDEND_HISTORY,
        },
      },
      {
        path: '/dividend/disable-user',
        name: 'dividend.disableUserScreen',
        component: () =>
          import('@/views/dividend/screens/DisableDividendUser.vue'),
        meta: {
          permissions: [
            Permission.DIVIDEND_GET_LIST_USER_DISABLE,
            Permission.DIVIDEND_DISABLE_USER,
            Permission.DIVIDEND_DELETE_DISABLE_USER,
          ],
          screen: Screen.DIVIDEND_DISABLE_USER,
        },
      },
      {
        path: '/obm-monitor/counter',
        name: 'obmMonitor.counter',
        component: () => import('@/views/apps/obm-monitor/Counter.vue'),
        meta: {
          permissions: [],
          screen: Screen.OBM_MONITOR,
        },
      },
      {
        path: '/futures/open-order',
        name: 'futures.openOrder',
        component: () => import('@/views/apps/futures/FuturesOpenOrder.vue'),
        meta: {
          permissions: [
            Permission.FUTURES_ORDER_READ,
            Permission.FUTURES_ORDER_UPDATE,
          ],
          screen: Screen.FUTURES_OPEN_ORDER,
        },
        beforeEnter: (to, from, next) => {
          if (['production'].includes(CONFIG.APP_ENV))
            next({ name: 'dashboard' })

          next()
        },
      },
      {
        path: '/futures/order-history',
        name: 'futures.orderHistory',
        component: () => import('@/views/apps/futures/FuturesOrderHistory.vue'),
        meta: {
          permissions: [Permission.FUTURES_ORDER_READ],
          screen: Screen.FUTURES_ORDER_HISTORY,
        },
        beforeEnter: (to, from, next) => {
          if (['production'].includes(CONFIG.APP_ENV))
            next({ name: 'dashboard' })

          next()
        },
      },
      {
        path: '/futures/user',
        name: 'futures.user',
        component: () => import('@/views/apps/futures/FuturesUser.vue'),
        // TODO: replace by FUTURES_USER_READ before release
        meta: {
          permissions: [Permission.USER_GET_LIST],
          screen: Screen.FUTURES_USER,
        },
        beforeEnter: (to, from, next) => {
          if (['production', 'staging'].includes(CONFIG.APP_ENV))
            next({ name: 'dashboard' })

          next()
        },
      },
      {
        path: '/futures/open-position',
        name: 'futures.openPosition',
        component: () => import('@/views/apps/futures/FuturesOpenPosition.vue'),
        meta: {
          permissions: [Permission.FUTURES_OPEN_POSITION_READ],
          screen: Screen.FUTURES_OPEN_POSITION,
        },
        beforeEnter: (to, from, next) => {
          if (['production'].includes(CONFIG.APP_ENV))
            next({ name: 'dashboard' })

          next()
        },
      },
      {
        path: '/futures/setting',
        name: 'futures.setting',
        component: () => import('@/views/apps/futures/FuturesSetting.vue'),
        meta: {
          permissions: [Permission.FUTURES_SETTINGS_LIST],
          screen: Screen.FUTURES_SETTING,
        },
        beforeEnter: (to, from, next) => {
          if (['production'].includes(CONFIG.APP_ENV))
            next({ name: 'dashboard' })

          next()
        },
      },
      {
        path: '/futures/setting/add',
        name: 'futures.setting.add',
        component: () => import('@/views/apps/futures/AddFuturesSetting.vue'),
        meta: {
          permissions: [Permission.FUTURES_SETTINGS_LIST],
          screen: Screen.FUTURES_SETTING,
        },
        beforeEnter: (to, from, next) => {
          if (['production'].includes(CONFIG.APP_ENV))
            next({ name: 'dashboard' })

          next()
        },
      },
      {
        path: '/futures/setting/:coin/:currency/detail',
        name: 'futures.setting.detail',
        component: () => import('@/views/apps/futures/EditFuturesSetting.vue'),
        meta: {
          permissions: [Permission.FUTURES_SETTINGS_LIST],
          screen: Screen.FUTURES_SETTING,
        },
        beforeEnter: (to, from, next) => {
          if (['production'].includes(CONFIG.APP_ENV))
            next({ name: 'dashboard' })

          next()
        },
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/components/page-layouts/Auth.vue'),
    meta: {
      auth: AuthMiddlewareConst.UNAUTH,
    },
    children: [
      {
        path: '/login',
        name: 'login',
        component: () => import('@/views/apps/auth/Login.vue'),
      },
      {
        path: '/sign-in',
        name: 'sign-in',
        component: () =>
          import('@/views/crafted/authentication/basic-flow/SignIn.vue'),
      },
      {
        path: '/sign-up',
        name: 'sign-up',
        component: () =>
          import('@/views/crafted/authentication/basic-flow/SignUp.vue'),
      },
      {
        path: '/password-reset',
        name: 'password-reset',
        component: () =>
          import('@/views/crafted/authentication/basic-flow/PasswordReset.vue'),
      },
    ],
  },
  {
    // the 404 route, when none of the above matches
    path: '/404',
    name: '404',
    meta: {
      auth: AuthMiddlewareConst.GUEST,
    },
    component: () => import('@/views/crafted/authentication/Error404.vue'),
  },
  {
    path: '/500',
    name: '500',
    meta: {
      auth: AuthMiddlewareConst.GUEST,
    },
    component: () => import('@/views/crafted/authentication/Error500.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const dashboardRoute = { name: 'dashboard' }
  const loginRoute = { name: 'login' }

  // reset config to initial state
  store.commit(Mutations.RESET_LAYOUT_CONFIG)

  store.commit(Mutations.SHOW_API_LOADING, false)

  // Scroll page to top on every route change
  setTimeout(() => {
    window.scrollTo(0, 0)
  }, 100)

  // Authenticate guard
  if (to.meta.auth === AuthMiddlewareConst.GUEST) {
    return next()
  }

  if (
    to.meta.auth === AuthMiddlewareConst.AUTH &&
    !store.getters.isUserAuthenticated
  ) {
    return next(loginRoute)
  }

  if (
    to.meta.auth === AuthMiddlewareConst.UNAUTH &&
    store.getters.isUserAuthenticated
  ) {
    return next(dashboardRoute)
  }

  if (to.meta.auth !== AuthMiddlewareConst.AUTH) {
    return next()
  }

  const currentUser = store.getters.currentUser
  if (currentUser.is_first_login && to.name != 'profile') {
    ElNotification.warning({ message: 'Please change your password!' })
    return next({
      name: 'profile',
      query: { modal: 'changePassword' },
    })
  }

  const permissions = to?.meta?.permissions as Array<number>
  const screen = to?.meta?.screen as number

  if (!permissions?.length && !screen) {
    return next()
  }

  let hasPermission = true
  let hasScreen = true
  if (permissions) {
    hasPermission = hasAllPermissions(permissions)
  }
  if (screen) {
    hasScreen = checkScreen(screen)
  }

  if (hasPermission && hasScreen) {
    return next()
  }

  ElNotification.error({ message: 'Permission Denied!' })
  return next(dashboardRoute)
})

export default router
