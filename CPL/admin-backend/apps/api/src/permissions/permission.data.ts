export enum Permission {
  CAMPAIGN_GET_LIST_KAFKA_EVENTS = 1,
  CAMPAIGN_GET_LIST_GRANT_TARGETS = 2,
  CAMPAIGN_GET_LIST_USER_CONDITIONS = 3,
  CAMPAIGN_GET_LIST = 4,
  CAMPAIGN_CREATE = 5,
  CAMPAIGN_READ = 6,
  CAMPAIGN_UPDATE = 7,
  CAMPAIGN_DELETE = 8,
  CAMPAIGN_GET_DISPLAY_CONDITIONS = 9,

  CHANNEL_GET_LIST = 10,
  CHANNEL_CREATE = 11,
  CHANNEL_READ = 12,
  CHANNEL_UPDATE = 13,
  CHANNEL_DELETE = 14,

  MISSION_CREATE = 15,
  MISSION_READ = 16,
  MISSION_UPDATE = 17,

  REJECT_REASON_GET_LIST = 18,

  SETTING_COUNTRY_CODE_GET_LIST = 19,

  TAG_GET_LIST = 20,
  TAG_CREATE = 21,
  TAG_READ = 22,
  TAG_UPDATE = 23,
  TAG_DELETE = 24,

  USER_GET_LIST = 25,
  USER_READ = 26,
  USER_EXPORT = 27,

  USER_MARKETING_GET_LIST = 28,
  USER_MARKETING_EXPORT = 29,

  USER_INFO_READ = 30,
  USER_INFO_READ_HISTORY = 31,

  USER_KYC_READ = 32,
  USER_KYC_READ_ENTERPRISE_INFO = 33,
  USER_KYC_READ_SCAN_DATA = 34,
  USER_KYC_RENEW_SCAN_DATA = 35,
  USER_KYC_REVIEW = 36,
  USER_KYC_READ_ADMIN_DECISIONS = 37,

  ROLE_GET_LIST = 38,
  ROLE_CREATE = 39,
  ROLE_READ = 40,
  ROLE_UPDATE = 41,
  ROLE_DELETE = 42,

  USER_TAG_CREATE = 43,
  USER_TAG_READ = 44,
  USER_TAG_DELETE = 45,

  REWARD_LOG_GET_LIST = 46,
  REWARD_LOG_COUNT = 47,
  REWARD_LOG_RESOLVE = 48,

  COIN_GET_LIST = 49,
  COIN_SEARCH = 50,

  // No need => Moved to auto add
  // COIN_SETTINGS_CREATE = 51,
  // COIN_SETTINGS_READ = 52,
  // COIN_SETTINGS_UPDATE = 53,
  // COIN_SETTINGS_DELETE = 54,

  PAIR_SETTINGS_CREATE = 55,
  PAIR_SETTINGS_READ = 56,
  PAIR_SETTINGS_UPDATE = 57,
  PAIR_SETTINGS_DELETE = 58,

  PAIR_CATEGORY_SETTINGS_CREATE = 59,
  PAIR_CATEGORY_SETTINGS_READ = 60,
  PAIR_CATEGORY_SETTINGS_UPDATE = 61,
  PAIR_CATEGORY_SETTINGS_DELETE = 62,

  APP_VERSION_CREATE = 63,
  APP_VERSION_READ = 64,
  APP_VERSION_UPDATE = 65,
  APP_VERSION_DELETE = 66,

  ADMIN_GET_LIST = 67,
  ADMIN_CREATE = 68,
  ADMIN_READ = 69,
  ADMIN_UPDATE = 70,
  ADMIN_SET_PERMISSION = 71,

  USER_LOGIN_HISTORY_READ = 72,

  OBM_SETTING_READ = 73,
  OBM_SETTING_UPDATE = 74,
  OBM_SETTING_DELETE = 75,

  WALLET_SETTING_READ = 76,
  WALLET_SETTING_UPDATE = 77,

  USER_EMAIL_CHANGE_HISTORY_READ = 78,

  TOGGLE_BAN_USER = 79,

  AUTO_WITHDRAW_GROUP_COMMON = 80,
  AUTO_WITHDRAW_GROUP_CREATE_UPDATE = 81,
  AUTO_WITHDRAW_GROUP_DETAIL = 82,
  AUTO_WITHDRAW_GENERATE_KEY = 83,
  AUTO_WITHDRAW_CURRENCY = 84,
  AUTO_WITHDRAW_TRANSACTION = 85,
  AUTO_WITHDRAW_HEALTH = 86,

  EXCHANGE_ORDER_READ = 87,
  EXCHANGE_ORDER_UPDATE = 88,

  IMPORT_BAN_USER = 89,

  SYSTEM_PUSH_SETTING_READ = 90,
  SYSTEM_PUSH_SETTING_UPDATE = 91,

  BALANCE_READ = 92,
  BALANCE_ADD = 93,

  BALANCE_TRANSFER_READ = 94,
  BALANCE_TRANSFER_SELF_TRANSFER = 95,

  EXCHANGE_USER_BLACK_LIST_READ = 96,
  EXCHANGE_USER_BLACK_LIST_UPDATE = 97,

  EXCHANGE_USER_UNLIMITED_READ = 98,
  EXCHANGE_USER_UNLIMITED_UPDATE = 99,

  EXCHANGE_USER_ZERO_FEE_READ = 100,
  EXCHANGE_USER_ZERO_FEE_UPDATE = 101,

  MARKET_MAKER_READ = 102,

  BALANCE_ABNORMAL_READ = 103,
  BALANCE_ABNORMAL_UPDATE = 104,

  MARKET_MAKER_MONITOR = 105,
  BALANCE_FILE_IMPORT_READ = 106,
  BALANCE_FILE_IMPORT_CREATE = 107,
  BALANCE_FILE_SETTING_READ = 108,

  OBM_BOT_READ = 109,
  OBM_BOT_UPDATE = 110,

  BALANCE_FILE_SETTING_CREATE = 111,
  BALANCE_HISTORY = 112,

  AUTO_ADD_SETTING_CREATE = 10000,
  AUTO_ADD_SETTING_UPDATE = 10001,
  AUTO_ADD_SMART_CONTRACT_GET = 10002,
  AUTO_ADD_SETTING_LIST = 10003,
  AUTO_ADD_SETTING_READ = 10004,

  MULTI_LANGUAGE_IMPORT_TRANSLATE = 11000,
  MULTI_LANGUAGE_GET_TRANSLATES = 11001,
  MULTI_LANGUAGE_SET_TRANSLATE = 11002,

  MULTI_LANGUAGE_LIST_LANGUAGE = 11003,
  MULTI_LANGUAGE_SET_LANGUAGE = 11004,
  MULTI_LANGUAGE_EXPORT_ALL_TRANSLATE = 11005,

  // giangnd added this logic for highlow permission code
  // for prevent duplicate or scale up api, each feature should be increased 10 units and sort by [a-z]
  HIGH_LOW_CRAWL_SETTING_CREATE = 13000,
  HIGH_LOW_CRAWL_SETTING_DELETE = 13001,
  HIGH_LOW_CRAWL_SETTING_READ = 13002,
  HIGH_LOW_CRAWL_SETTING_UPDATE = 13003,
  HIGH_LOW_NEWS_CREATE = 13010,
  HIGH_LOW_NEWS_DELETE = 13011,
  HIGH_LOW_NEWS_READ = 13012,
  HIGH_LOW_NEWS_UPDATE = 13013,
  HIGH_LOW_PAIR_PRICE_CREATE = 13020,
  HIGH_LOW_PAIR_PRICE_DELETE = 13021,
  HIGH_LOW_PAIR_PRICE_READ = 13022,
  HIGH_LOW_PAIR_PRICE_UPDATE = 13023,
  HIGH_LOW_PAIR_SETTING_CREATE = 13030,
  HIGH_LOW_PAIR_SETTING_DELETE = 13031,
  HIGH_LOW_PAIR_SETTING_READ = 13032,
  HIGH_LOW_PAIR_SETTING_UPDATE = 13033,
  HIGH_LOW_SETTING_CREATE = 13040,
  HIGH_LOW_SETTING_DELETE = 13041,
  HIGH_LOW_SETTING_READ = 13042,
  HIGH_LOW_SETTING_UPDATE = 13043,
  HIGH_LOW_TRADING_MODE_CREATE = 13050,
  HIGH_LOW_TRADING_MODE_DELETE = 13051,
  HIGH_LOW_TRADING_MODE_READ = 13052,
  HIGH_LOW_TRADING_MODE_UPDATE = 13053,
  HIGH_LOW_TRADING_PAIR_CREATE = 13060,
  HIGH_LOW_TRADING_PAIR_DELETE = 13061,
  HIGH_LOW_TRADING_PAIR_READ = 13062,
  HIGH_LOW_TRADING_PAIR_UPDATE = 13063,
  HIGH_LOW_UNLIMITED_USER_CREATE = 13070,
  HIGH_LOW_UNLIMITED_USER_DELETE = 13071,
  HIGH_LOW_UNLIMITED_USER_READ = 13072,
  HIGH_LOW_UNLIMITED_USER_UPDATE = 13073,
  HIGH_LOW_USER_BALANCE_READ = 13080,
  HIGH_LOW_USER_TRADING_READ = 13090,
  HIGH_LOW_WINNING_RATE_READ = 13100,
  HIGH_LOW_BLOCK_USER_CREATE = 13110,
  HIGH_LOW_BLOCK_USER_DELETE = 13111,
  HIGH_LOW_BLOCK_USER_READ = 13112,
  HIGH_LOW_USER_GRANT_PAYOUT_CREATE = 13120,
  HIGH_LOW_USER_GRANT_PAYOUT_DELETE = 13121,
  HIGH_LOW_USER_GRANT_PAYOUT_READ = 13122,
  HIGH_LOW_USER_GRANT_PAYOUT_UPDATE = 13123,

  API_MANAGEMENT_LIST = 14000,
  API_MANAGEMENT_DETAIL = 14001,
  API_MANAGEMENT_CHANGE_STATUS = 14002,

  GLOBAL_NOTIFICATION_CREATE = 15001,
  GLOBAL_NOTIFICATION_READ = 15002,
  GLOBAL_NOTIFICATION_UPDATE = 15003,

  NOTIFICATION_CATEGORY_READ = 16001,

  ACTION_LOG_HISTORY_READ = 17001,

  DIVIDEND_GET_LIST = 200,
  DIVIDEND_GET_DETAIL = 201,
  DIVIDEND_GET_CAMPAIGN_NAME = 202,
  DIVIDEND_GET_CODE_LIST = 203,
  DIVIDEND_GET_ADVANCED = 204,
  DIVIDEND_CREATED = 205,
  DIVIDEND_UPDATE = 206,
  DIVIDEND_CANCEL = 207,
  DIVIDEND_CREATE_CODE = 208,
  DIVIDEND_TOOGLE_CODE = 209,
  DIVIDEND_GET_HISTORY = 210,
  DIVIDEND_GET_LIST_USER_DISABLE = 211,
  DIVIDEND_DISABLE_USER = 212,
  DIVIDEND_DELETE_DISABLE_USER = 213,

  USER_NOTE_CREATE = 18001,
  USER_NOTE_READ = 18002,

  USER_AUTHENTICATOR_RESET = 19001,

  USER_BALANCE_CHANGE_HISTORY = 300,

  USER_CHANGE_EMAIL = 20001,

  GRID_TRADING_SETTING_READ = 30001,
  GRID_TRADING_SETTING_UPDATE = 30002,

  GRID_TRADING_READ = 30003,

  BALANCE_CONVERT_SETTING_GET_LIST = 500,
  BALANCE_CONVERT_SETTING_GET_LOGS = 501,
  BALANCE_CONVERT_SETTING_GET_DETAIL = 502,
  BALANCE_CONVERT_SETTING_CREATE = 503,
  BALANCE_CONVERT_SETTING_UPDATE = 504,
  BALANCE_CONVERT_SETTING_DELETE = 505,
  BALANCE_SWAP_HISTORY = 506,
  BALANCE_TRANSFER_HISTORY = 507,
  BALANCE_CONVERT_SMALL_HISTORY = 508,

  // Reason roles
  USER_REASON_CATEGORY_CREATE = 69696,
  USER_REASON_CATEGORY_UPDATE = 69697,
  USER_REASON_CATEGORY_DELETE = 69698,
  USER_REASON_CATEGORY_GET_LIST = 69699,
  USER_REASON_CREATE = 69700,
  USER_REASON_UPDATE = 69701,
  USER_REASON_DELETE = 69702,
  USER_REASON_GET_LIST = 69703,

  FUTURES_ORDER_READ = 21000,
  FUTURES_ORDER_UPDATE = 21001,
  FUTURES_USER_READ = 21002,
  FUTURES_OPEN_POSITION_READ = 21003,
  FUTURES_SETTINGS_LIST = 21004,

  MT5_PAYMENT_ECHELON_PAYOUT_READ = 22000,
  MT5_PAYMENT_ECHELON_PAYOUT_ADMIN_APPROVE_REQUEST = 22002,
  MT5_PAYMENT_ECHELON_PAYOUT_ADMIN_REJECT_REQUEST = 22003,
  MT5_PAYMENT_ECHELON_PAYIN_READ = 22004,
  MT5_PAYMENT_ECHELON_PAYIN_ADMIN_APPROVE_REQUEST = 22005,
  MT5_PAYMENT_ECHELON_PAYIN_ADMIN_REJECT_REQUEST = 22006,

  USER_INFO_UPDATE = 23000,
}

export const PERMISSION_DATA_GROUP_BY_MODULE = {
  campaign: [
    {
      id: Permission.CAMPAIGN_GET_LIST_KAFKA_EVENTS,
      description: 'Get List Kafka events',
    },
    {
      id: Permission.CAMPAIGN_GET_LIST_GRANT_TARGETS,
      description: 'Get List Grant Target',
    },
    {
      id: Permission.CAMPAIGN_GET_LIST_USER_CONDITIONS,
      description: 'Get List User Condition',
    },
    {
      id: Permission.CAMPAIGN_GET_LIST,
      description: 'Get List Campaign',
    },
    {
      id: Permission.CAMPAIGN_CREATE,
      description: 'Create Campaign',
    },
    {
      id: Permission.CAMPAIGN_READ,
      description: 'View Campaign Detail',
    },
    {
      id: Permission.CAMPAIGN_UPDATE,
      description: 'Update Campaign',
    },
    {
      id: Permission.CAMPAIGN_DELETE,
      description: 'Delete Campaign',
    },
    {
      id: Permission.CAMPAIGN_GET_DISPLAY_CONDITIONS,
      description: 'Get List Display Condition',
    },
  ],
  channel: [
    {
      id: Permission.CHANNEL_GET_LIST,
      description: 'Get list channel',
    },
    {
      id: Permission.CHANNEL_CREATE,
      description: 'Create an new channel',
    },
    {
      id: Permission.CHANNEL_READ,
      description: 'Read the channel detail',
    },
    {
      id: Permission.CHANNEL_UPDATE,
      description: 'Update channel',
    },
    {
      id: Permission.CHANNEL_DELETE,
      description: 'Delete the channel',
    },
  ],
  mission: [
    {
      id: Permission.MISSION_CREATE,
      description: 'Create Mission',
    },
    {
      id: Permission.MISSION_READ,
      description: 'Read a mission',
    },
    {
      id: Permission.MISSION_UPDATE,
      description: 'Update a mission',
    },
  ],
  rejectionReason: [
    {
      id: Permission.REJECT_REASON_GET_LIST,
      description: 'Get List Reject Reason',
    },
  ],
  // setting: [
  //   {
  //     id: Permission.SETTING_COUNTRY_CODE_GET_LIST,
  //     description: 'Get List Country Code',
  //   },
  // ],
  tag: [
    {
      id: Permission.TAG_GET_LIST,
      description: 'Get List Tag',
    },
    {
      id: Permission.TAG_CREATE,
      description: 'Create Tag',
    },
    {
      id: Permission.TAG_READ,
      description: 'Get Tag details',
    },
    {
      id: Permission.TAG_UPDATE,
      description: 'Update Tag',
      isAllowed: true,
      denyText: '',
    },
    {
      id: Permission.TAG_DELETE,
      description: 'Delete Tag',
    },
  ],
  user: [
    {
      id: Permission.USER_GET_LIST,
      description: 'Get List User For Management',
    },
    {
      id: Permission.USER_READ,
      description: 'View User Detail',
    },
    {
      id: Permission.USER_EXPORT,
      description: 'Export List User For Management',
    },
    {
      id: Permission.TOGGLE_BAN_USER,
      description: 'Ban/Unban button in user list',
    },
    {
      id: Permission.IMPORT_BAN_USER,
      description: 'Import users in csv to ban',
    },
    {
      id: Permission.USER_CHANGE_EMAIL,
    },
  ],
  marketing: [
    {
      id: Permission.USER_MARKETING_GET_LIST,
      description: 'Get List User for Marketing',
    },
    {
      id: Permission.USER_MARKETING_EXPORT,
      description: 'Export List User for Marketing',
    },
    {
      id: Permission.REWARD_LOG_GET_LIST,
      description: 'Get list missing reward log',
    },
    {
      id: Permission.REWARD_LOG_COUNT,
      description: 'Count missing reward log',
    },
    {
      id: Permission.REWARD_LOG_RESOLVE,
      description: 'Resolve missing reward',
    },
  ],
  userInfo: [
    {
      id: Permission.USER_INFO_READ,
      description: 'Get User info',
    },
    {
      id: Permission.USER_INFO_READ_HISTORY,
      description: 'Get User info history',
    },
    {
      id: Permission.USER_INFO_UPDATE,
    },
  ],
  userKyc: [
    {
      id: Permission.USER_KYC_READ,
      description: 'View kyc documents',
    },
    {
      id: Permission.USER_KYC_READ_ENTERPRISE_INFO,
      description: 'View enterprise info',
    },
    {
      id: Permission.USER_KYC_RENEW_SCAN_DATA,
      description: 'Renew scan data of kyc',
    },
    {
      id: Permission.USER_KYC_REVIEW,
      description: 'Review kyc of user',
    },
    {
      id: Permission.USER_KYC_READ_SCAN_DATA,
      description: 'View scan data of kyc',
    },
    {
      id: Permission.USER_KYC_READ_ADMIN_DECISIONS,
      description: 'View admin decision of kyc',
    },
  ],
  userTag: [
    {
      id: Permission.USER_TAG_CREATE,
      description: 'Create User Tag',
    },
    {
      id: Permission.USER_TAG_READ,
      description: 'Get User Tag',
    },
    {
      id: Permission.USER_TAG_DELETE,
      description: 'Remove user tag',
    },
  ],

  coin: [
    {
      id: Permission.COIN_GET_LIST,
      description: 'Get List coins',
    },
    {
      id: Permission.COIN_SEARCH,
      description: 'Search coins',
    },
  ],
  // coinSetting: [
  //   {
  //     id: Permission.COIN_SETTINGS_READ,
  //     description: 'Get coin settings',
  //   },
  //   {
  //     id: Permission.COIN_SETTINGS_CREATE,
  //     description: 'Create a coin setting',
  //   },
  //   {
  //     id: Permission.COIN_SETTINGS_UPDATE,
  //     description: 'Patch a coin setting',
  //   },
  //   {
  //     id: Permission.COIN_SETTINGS_DELETE,
  //     description: 'Delete a coin setting',
  //   },
  // ],
  appVersion: [
    {
      id: Permission.APP_VERSION_READ,
      description: 'Get app version settings',
    },
    {
      id: Permission.APP_VERSION_CREATE,
      description: 'Create an app version settings',
    },
    {
      id: Permission.APP_VERSION_UPDATE,
      description: 'Update an app version settings',
    },
    {
      id: Permission.APP_VERSION_DELETE,
      description: 'Delete an app version settings',
    },
  ],
  adminAccountAndPermission: [
    {
      id: Permission.ADMIN_GET_LIST,
      description: 'Get list admins',
    },
    {
      id: Permission.ADMIN_CREATE,
      description: 'Create admin',
    },
    {
      id: Permission.ADMIN_READ,
      description: 'View Admin detail',
    },
    {
      id: Permission.ADMIN_UPDATE,
      description: 'Update admin',
    },
    {
      id: Permission.ADMIN_SET_PERMISSION,
      description: 'Set Permission For Admin',
    },
    {
      id: Permission.ROLE_GET_LIST,
      description: 'Get List Role',
    },
    {
      id: Permission.ROLE_READ,
      description: 'Read Role',
    },
    {
      id: Permission.ROLE_CREATE,
      description: 'Create Role',
    },
    {
      id: Permission.ROLE_UPDATE,
      description: 'Update Role',
    },
    {
      id: Permission.ROLE_DELETE,
      description: 'Delete Role',
    },
    {
      id: Permission.ACTION_LOG_HISTORY_READ,
      description: 'View Admin Action Log',
    },
  ],
  history: [
    {
      id: Permission.USER_LOGIN_HISTORY_READ,
      description: 'View User Login History',
    },
    {
      id: Permission.USER_EMAIL_CHANGE_HISTORY_READ,
      description: 'View User Email change history',
    },
    {
      id: Permission.USER_BALANCE_CHANGE_HISTORY,
      description: 'User balance change history',
    },
  ],
  obmSetting: [
    {
      id: Permission.OBM_SETTING_READ,
      description: 'Read OBM setting',
    },
    {
      id: Permission.OBM_SETTING_UPDATE,
      description: 'Update OBM setting',
    },
    {
      id: Permission.OBM_SETTING_DELETE,
      description: 'Delete OBM setting',
    },
  ],
  walletSetting: [
    {
      id: Permission.WALLET_SETTING_READ,
      description: 'Read wallet setting',
    },
    {
      id: Permission.WALLET_SETTING_UPDATE,
      description: 'Update wallet setting',
    },
    {
      id: Permission.COIN_GET_LIST,
      description: 'Get List coins',
    },
    {
      id: Permission.AUTO_ADD_SETTING_LIST,
      description: 'List auto add settings',
    },
  ],

  //////// Auto Withdraw ////////
  autoWithdraw: [
    {
      id: Permission.AUTO_WITHDRAW_GROUP_COMMON,
      description: 'Auto withdraw group',
    },
    {
      id: Permission.AUTO_WITHDRAW_GROUP_CREATE_UPDATE,
      description: 'Create Update withdraw group',
    },
    {
      id: Permission.AUTO_WITHDRAW_GENERATE_KEY,
      description: 'Create a private key',
    },
    {
      id: Permission.AUTO_WITHDRAW_GROUP_DETAIL,
      description: 'Get list transaction on auto withdraw detail',
    },
    {
      id: Permission.AUTO_WITHDRAW_HEALTH,
      description: 'Get health check',
    },
    {
      id: Permission.AUTO_WITHDRAW_CURRENCY,
      description: 'Get token of currency',
    },
    {
      id: Permission.AUTO_WITHDRAW_TRANSACTION,
      description: 'Get transaction list API',
    },
  ],

  notification: [
    {
      id: Permission.SYSTEM_PUSH_SETTING_READ,
      description: 'Read system push setting',
    },
    {
      id: Permission.SYSTEM_PUSH_SETTING_UPDATE,
      description: 'Update system push setting',
    },
  ],

  balance: [
    { id: Permission.BALANCE_READ, description: 'Get list balance' },
    { id: Permission.BALANCE_ADD, description: 'Add balance' },
    // {
    //   id: Permission.BALANCE_TRANSFER_READ,
    //   description: 'Get List balance transfer',
    // },
    {
      id: Permission.BALANCE_TRANSFER_SELF_TRANSFER,
      description: 'Self transfer balance',
    },
    {
      id: Permission.BALANCE_ABNORMAL_READ,
      description: 'Get list abnormal balance',
    },
    {
      id: Permission.BALANCE_ABNORMAL_UPDATE,
      description: 'Correct abnormal balance',
    },
    {
      id: Permission.BALANCE_FILE_IMPORT_CREATE,
      description: 'Add balance by import file',
    },
    {
      id: Permission.BALANCE_FILE_IMPORT_READ,
      description: 'List balance import file',
    },
    {
      id: Permission.BALANCE_FILE_SETTING_READ,
      description: 'List balance import file setting',
    },
    {
      id: Permission.BALANCE_FILE_SETTING_CREATE,
      description: 'Edit balance import file setting',
    },
    {
      id: Permission.BALANCE_HISTORY,
      description: 'Balance history',
    },
  ],
  //////// Exchange setting ////////
  exchangeSetting: {
    pairSetting: [
      {
        id: Permission.PAIR_SETTINGS_READ,
        description: 'Get pair settings',
      },
      {
        id: Permission.PAIR_SETTINGS_CREATE,
        description: 'Create a pair setting',
      },
      {
        id: Permission.PAIR_SETTINGS_UPDATE,
        description: 'Patch a pair setting',
      },
      {
        id: Permission.PAIR_SETTINGS_DELETE,
        description: 'Delete a pair setting',
      },
    ],
    pairCategorySetting: [
      {
        id: Permission.PAIR_CATEGORY_SETTINGS_READ,
        description: 'Get pair category settings',
      },
      {
        id: Permission.PAIR_CATEGORY_SETTINGS_CREATE,
        description: 'Create a pair category setting',
      },
      {
        id: Permission.PAIR_CATEGORY_SETTINGS_UPDATE,
        description: 'Patch a pair category setting',
      },
      {
        id: Permission.PAIR_CATEGORY_SETTINGS_DELETE,
        description: 'Delete a pair category setting',
      },
    ],
    exchangeUserBackList: [
      {
        id: Permission.EXCHANGE_USER_BLACK_LIST_READ,
        description: 'Get list exchange user black list',
      },
      {
        id: Permission.EXCHANGE_USER_BLACK_LIST_UPDATE,
        description: 'Update exchange user black list',
      },
    ],
    exchangeUserUnlimited: [
      {
        id: Permission.EXCHANGE_USER_UNLIMITED_READ,
        description: 'Get list exchange user unlimited',
      },
      {
        id: Permission.EXCHANGE_USER_UNLIMITED_UPDATE,
        description: 'Update exchange user unlimited',
      },
    ],
    exchangeUserZeroFee: [
      {
        id: Permission.EXCHANGE_USER_ZERO_FEE_READ,
        description: 'Get list exchange user zero fee',
      },
      {
        id: Permission.EXCHANGE_USER_ZERO_FEE_UPDATE,
        description: 'Update exchange user zero fee',
      },
    ],
    obmBot: [
      {
        id: Permission.OBM_BOT_READ,
        description: 'View list bot',
      },
      {
        id: Permission.OBM_BOT_UPDATE,
        description: 'Update list bot',
      },
    ],
  },
  //////// Exchange ////////
  exchange: {
    exchangeOrder: [
      {
        id: Permission.EXCHANGE_ORDER_READ,
        description: 'Get list exchange order',
      },
      {
        id: Permission.EXCHANGE_ORDER_UPDATE,
        description: 'Update exchange order',
      },
    ],
  },

  marketMaker: [
    {
      id: Permission.MARKET_MAKER_READ,
      description: 'Config Market maker data and settings',
    },
    {
      id: Permission.MARKET_MAKER_MONITOR,
      description: 'Import order market maker',
    },
  ],

  autoAdd: [
    {
      id: Permission.AUTO_ADD_SETTING_CREATE,
      description: 'Create auto add settings',
    },
    {
      id: Permission.AUTO_ADD_SETTING_UPDATE,
      description: 'Update auto add settings',
    },
    {
      id: Permission.AUTO_ADD_SMART_CONTRACT_GET,
      description: 'Get SmartContract auto add settings',
    },
    {
      id: Permission.AUTO_ADD_SETTING_LIST,
      description: 'List auto add settings',
    },
    {
      id: Permission.AUTO_ADD_SETTING_READ,
      description: 'View currency settings',
    },
  ],
  //////// Language setting ////////
  languageSetting: [
    {
      id: Permission.MULTI_LANGUAGE_IMPORT_TRANSLATE,
      description: 'Import Translate to Language Setting',
    },
    {
      id: Permission.MULTI_LANGUAGE_GET_TRANSLATES,
      description: 'Get Translates from Language Setting',
    },
    {
      id: Permission.MULTI_LANGUAGE_SET_TRANSLATE,
      description: 'update translate Language Setting',
    },
    {
      id: Permission.MULTI_LANGUAGE_EXPORT_ALL_TRANSLATE,
      description: 'Export all Translates',
    },
    {
      id: Permission.MULTI_LANGUAGE_LIST_LANGUAGE,
      description: 'list Language Setting',
    },
    {
      id: Permission.MULTI_LANGUAGE_SET_LANGUAGE,
      description: 'create Language Setting',
    },
  ],
  highLow: [
    {
      id: Permission.HIGH_LOW_CRAWL_SETTING_CREATE,
      description: 'Create high low crawl setting',
    },
    {
      id: Permission.HIGH_LOW_CRAWL_SETTING_DELETE,
      description: 'Delete high low crawl setting',
    },
    {
      id: Permission.HIGH_LOW_CRAWL_SETTING_READ,
      description: 'View high low crawl setting',
    },
    {
      id: Permission.HIGH_LOW_CRAWL_SETTING_UPDATE,
      description: 'Update high low crawl setting',
    },
    {
      id: Permission.HIGH_LOW_NEWS_CREATE,
      description: 'Create high low news',
    },
    {
      id: Permission.HIGH_LOW_NEWS_DELETE,
      description: 'Delete high low news',
    },
    {
      id: Permission.HIGH_LOW_NEWS_READ,
      description: 'View high low news',
    },
    {
      id: Permission.HIGH_LOW_NEWS_UPDATE,
      description: 'Update high low news',
    },
    {
      id: Permission.HIGH_LOW_PAIR_PRICE_CREATE,
      description: 'Create high low pair price',
    },
    {
      id: Permission.HIGH_LOW_PAIR_PRICE_DELETE,
      description: 'Delete high low pair price',
    },
    {
      id: Permission.HIGH_LOW_PAIR_PRICE_READ,
      description: 'View high low pair price',
    },
    {
      id: Permission.HIGH_LOW_PAIR_PRICE_UPDATE,
      description: 'Update high low pair price',
    },
    {
      id: Permission.HIGH_LOW_PAIR_SETTING_CREATE,
      description: 'Create high low pair setting',
    },
    {
      id: Permission.HIGH_LOW_PAIR_SETTING_DELETE,
      description: 'Delete high low pair setting',
    },
    {
      id: Permission.HIGH_LOW_PAIR_SETTING_READ,
      description: 'View high low pair setting',
    },
    {
      id: Permission.HIGH_LOW_PAIR_SETTING_UPDATE,
      description: 'Update high low pair setting',
    },
    {
      id: Permission.HIGH_LOW_SETTING_CREATE,
      description: 'Create high low setting',
    },
    {
      id: Permission.HIGH_LOW_SETTING_DELETE,
      description: 'Delete high low setting',
    },
    {
      id: Permission.HIGH_LOW_SETTING_READ,
      description: 'View high low setting',
    },
    {
      id: Permission.HIGH_LOW_SETTING_UPDATE,
      description: 'Update high low setting',
    },
    {
      id: Permission.HIGH_LOW_TRADING_MODE_CREATE,
      description: 'Create high low trading mode',
    },
    {
      id: Permission.HIGH_LOW_TRADING_MODE_DELETE,
      description: 'Delete high low trading mode',
    },
    {
      id: Permission.HIGH_LOW_TRADING_MODE_READ,
      description: 'View high low trading mode',
    },
    {
      id: Permission.HIGH_LOW_TRADING_MODE_UPDATE,
      description: 'Update high low trading mode',
    },
    {
      id: Permission.HIGH_LOW_TRADING_PAIR_CREATE,
      description: 'Create high low trading pair',
    },
    {
      id: Permission.HIGH_LOW_TRADING_PAIR_DELETE,
      description: 'Delete high low trading pair',
    },
    {
      id: Permission.HIGH_LOW_TRADING_PAIR_READ,
      description: 'View high low trading pair',
    },
    {
      id: Permission.HIGH_LOW_TRADING_PAIR_UPDATE,
      description: 'Update high low trading pair',
    },
    {
      id: Permission.HIGH_LOW_UNLIMITED_USER_CREATE,
      description: 'Create high low unlimited user',
    },
    {
      id: Permission.HIGH_LOW_UNLIMITED_USER_DELETE,
      description: 'Delete high low unlimited user',
    },
    {
      id: Permission.HIGH_LOW_UNLIMITED_USER_READ,
      description: 'View high low unlimited user',
    },
    {
      id: Permission.HIGH_LOW_UNLIMITED_USER_UPDATE,
      description: 'Update high low unlimited user',
    },
    {
      id: Permission.HIGH_LOW_BLOCK_USER_CREATE,
      description: 'Create high low block user',
    },
    {
      id: Permission.HIGH_LOW_BLOCK_USER_DELETE,
      description: 'Delete high low block user',
    },
    {
      id: Permission.HIGH_LOW_BLOCK_USER_READ,
      description: 'View high low block user',
    },
    {
      id: Permission.HIGH_LOW_USER_GRANT_PAYOUT_CREATE,
      description: 'Create high low user grant payout',
    },
    {
      id: Permission.HIGH_LOW_USER_GRANT_PAYOUT_DELETE,
      description: 'Delete high low user grant payout',
    },
    {
      id: Permission.HIGH_LOW_USER_GRANT_PAYOUT_READ,
      description: 'View high low user grant payout',
    },
    {
      id: Permission.HIGH_LOW_USER_GRANT_PAYOUT_UPDATE,
      description: 'update high low user grant payout',
    },
    {
      id: Permission.HIGH_LOW_USER_BALANCE_READ,
      description: 'View high low user balance',
    },
    {
      id: Permission.HIGH_LOW_USER_TRADING_READ,
      description: 'View high low user tradding',
    },
    {
      id: Permission.HIGH_LOW_WINNING_RATE_READ,
      description: 'View high low winning rete',
    },
  ],
  apiKeyManagement: [
    {
      id: Permission.API_MANAGEMENT_LIST,
      description: 'List API Key Management',
    },
    {
      id: Permission.API_MANAGEMENT_DETAIL,
      description: 'Detail API Key Management',
    },
    {
      id: Permission.API_MANAGEMENT_CHANGE_STATUS,
      description: 'Approve API Key request',
    },
  ],
  groupNotification: [
    {
      id: Permission.GLOBAL_NOTIFICATION_CREATE,
    },
    {
      id: Permission.GLOBAL_NOTIFICATION_READ,
    },
    {
      id: Permission.GLOBAL_NOTIFICATION_UPDATE,
    },
  ],
  notificationCategory: [
    {
      id: Permission.NOTIFICATION_CATEGORY_READ,
    },
  ],
  dividend: [
    {
      id: Permission.DIVIDEND_GET_LIST,
      description: 'Get list dividend',
    },
    {
      id: Permission.DIVIDEND_GET_DETAIL,
      description: 'Get detail dividend',
    },
    {
      id: Permission.DIVIDEND_GET_CAMPAIGN_NAME,
      description: 'Get all dividend campaign name',
    },
    {
      id: Permission.DIVIDEND_GET_CODE_LIST,
      description: 'Get list code',
    },
    {
      id: Permission.DIVIDEND_GET_ADVANCED,
      description: 'Get advanced',
    },
    {
      id: Permission.DIVIDEND_CREATED,
      description: 'Create dividend',
    },
    {
      id: Permission.DIVIDEND_UPDATE,
      description: 'Update dividend',
    },
    {
      id: Permission.DIVIDEND_CANCEL,
      description: 'Cancel dividend',
    },
    {
      id: Permission.DIVIDEND_CREATE_CODE,
      description: 'Create code',
    },
    {
      id: Permission.DIVIDEND_TOOGLE_CODE,
      description: 'Enable/disable code',
    },
    {
      id: Permission.DIVIDEND_GET_HISTORY,
      description: 'Get dividend history',
    },
    {
      id: Permission.DIVIDEND_GET_LIST_USER_DISABLE,
      description: 'Get list user disabled',
    },
    {
      id: Permission.DIVIDEND_DISABLE_USER,
      description: 'Disable user',
    },
    {
      id: Permission.DIVIDEND_DELETE_DISABLE_USER,
      description: 'Delete disable user',
    },
  ],
  userNote: [
    {
      id: Permission.USER_NOTE_CREATE,
    },
    {
      id: Permission.USER_NOTE_READ,
    },
  ],
  userAuthenticator: [{ id: Permission.USER_AUTHENTICATOR_RESET }],
  spotGridSetting: [
    {
      id: Permission.GRID_TRADING_SETTING_READ,
      description: 'View grid trading setting',
    },
    {
      id: Permission.GRID_TRADING_SETTING_UPDATE,
      description: 'Update grid trading setting',
    },
  ],
  spotGrid: [
    {
      id: Permission.GRID_TRADING_READ,
      description: 'View grid trading',
    },
  ],
  balanceConvert: [
    {
      id: Permission.BALANCE_CONVERT_SETTING_GET_LIST,
      description: 'Get list setting convert',
    },
    {
      id: Permission.BALANCE_CONVERT_SETTING_GET_LOGS,
      description: 'Get logs setting convert',
    },
    {
      id: Permission.BALANCE_CONVERT_SETTING_GET_DETAIL,
      description: 'Get detail setting convert',
    },
    {
      id: Permission.BALANCE_CONVERT_SETTING_CREATE,
      description: 'Create setting convert',
    },
    {
      id: Permission.BALANCE_CONVERT_SETTING_UPDATE,
      description: 'Update setting convert',
    },
    {
      id: Permission.BALANCE_CONVERT_SETTING_DELETE,
      description: 'Delete setting convert',
    },
  ],
  balanceConvertHistory: [
    {
      id: Permission.BALANCE_CONVERT_SMALL_HISTORY,
      description: 'Get convert small coin history of users',
    },
    {
      id: Permission.BALANCE_SWAP_HISTORY,
      description: 'Get swap history of users',
    },
    {
      id: Permission.BALANCE_TRANSFER_HISTORY,
      description: 'Get transfer history of users',
    },
  ],
  future: [
    {
      id: Permission.FUTURES_ORDER_READ,
      description: 'Get list future order',
    },
    {
      id: Permission.FUTURES_ORDER_UPDATE,
      description: 'Update future order',
    },
    {
      id: Permission.FUTURES_USER_READ,
      description: 'Get list future user',
    },
    {
      id: Permission.FUTURES_OPEN_POSITION_READ,
      description: 'Get list open position',
    },
    {
      id: Permission.FUTURES_SETTINGS_LIST,
      description: 'Get list future settings',
    },
  ],
  mt5: [
    {
      id: Permission.MT5_PAYMENT_ECHELON_PAYOUT_READ,
      description: 'Read EchelonPay payout requests information',
    },
    {
      id: Permission.MT5_PAYMENT_ECHELON_PAYOUT_ADMIN_APPROVE_REQUEST,
      description: 'Approve payout request',
    },
    {
      id: Permission.MT5_PAYMENT_ECHELON_PAYOUT_ADMIN_REJECT_REQUEST,
      description: 'Reject payout request',
    },
    {
      id: Permission.MT5_PAYMENT_ECHELON_PAYIN_READ,
      description: 'Read EchelonPay payin requests information',
    },
    {
      id: Permission.MT5_PAYMENT_ECHELON_PAYIN_ADMIN_APPROVE_REQUEST,
      description: 'Approve payin request',
    },
    {
      id: Permission.MT5_PAYMENT_ECHELON_PAYIN_ADMIN_REJECT_REQUEST,
      description: 'Reject payin request',
    },
  ],
  reason: [
    {
      id: Permission.USER_REASON_CREATE,
      description: 'Create rejection reason',
    },
    {
      id: Permission.USER_REASON_UPDATE,
      description: 'Update rejection reason',
    },
    {
      id: Permission.USER_REASON_GET_LIST,
      description: 'View list rejection reason',
    },
    {
      id: Permission.USER_REASON_DELETE,
      description: 'Delete rejection reason',
    },
    {
      id: Permission.USER_REASON_CATEGORY_CREATE,
      description: 'Create reason category',
    },
    {
      id: Permission.USER_REASON_CATEGORY_UPDATE,
      description: 'Update reason category',
    },
    {
      id: Permission.USER_REASON_CATEGORY_GET_LIST,
      description: 'Get list reason category',
    },
    {
      id: Permission.USER_REASON_CATEGORY_DELETE,
      description: 'Delete reason category',
    },
  ],
}

export const PERMISSION_DATA = Object.entries(
  PERMISSION_DATA_GROUP_BY_MODULE,
).reduce((result, [module, permissions]) => {
  if (Array.isArray(permissions)) {
    permissions = permissions.map((permission) => ({ ...permission, module }))
    result = [...result, ...permissions]
  } else if (isObject(permissions)) {
    Object.entries(permissions).forEach(([subModule, subPermissions]) => {
      permissions = subPermissions.map((permission) => ({
        ...permission,
        module,
        subModule,
      }))
      result = [...result, ...permissions]
    })
  }

  return result
}, [])

function isObject(item: unknown) {
  return typeof item === 'object' && !Array.isArray(item) && item !== null
}
