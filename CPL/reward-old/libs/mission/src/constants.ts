import {
  DELIVERY_METHOD_WALLET,
  EVENTS,
  GRANT_METHOD,
  GRANT_TARGET_USER,
  OrderType,
  PROPERTY_TO_CALCULATE_AMOUNT,
} from './enum'

export const MISSION_SEARCH_FIELD_MAP = {
  title: 'mission.title',
  title_ja: 'mission.titleJa',
  guide_link: 'mission.guideLink',
  guide_link_ja: 'mission.guideLinkJa',
  detail_explain: 'mission.detailExplain',
  detail_explain_ja: 'mission.detailExplainJa',
}

// completed dựa theo success_count, nên sẽ map completed = success_count
export const MISSION_SORT_FIELD_MAP = {
  title: 'mission.title',
  title_ja: 'mission.titleJa',
  guide_link: 'mission.guideLink',
  guide_link_ja: 'mission.guideLinkJa',
  detail_explain: 'campaign.detailExplain',
  detail_explain_ja: 'campaign.detailExplainJa',
  opening_date: 'campaign.openingDate',
  closing_date: 'campaign.closingDate',
  completed: 'success_count',
}

export const USER_STATUS = {
  ACTIVE: 1,
  INACTIVE: 2,
}

export const USER_TYPE = {
  NORMAL: 1,
  BOT: 2,
}

export const USER_EMAIL_VERIFY_STATUS = {
  VERIFIED: 1,
  UNVERIFIED: 2,
}

export const USER_AUTHENTICATOR_VERIFY_STATUS = {
  VERIFIED: 1,
  UNVERIFIED: 2,
}

export const USER_KYC_VERIFY_STATUS = {
  VERIFIED: 1,
  UNVERIFIED: 2,
  PENDING: 3,
  REJECTED: 4,
}

export const USER_ACCOUNT_LV_OPTIONS = {
  LV_1: 1,
  LV_2: 2,
  LV_3: 3,
  LV_4: 4,
  LV_5: 5,
}

export const KYC_TYPE = {
  PERSONAL: 1,
  ENTERPRISE: 2,
}

export const KYC_ID_DOCUMENT_TYPE = {
  PASSPORT: 1,
  ID_CARD: 2,
  DRIVING_LICENCE: 3,
  OTHERS: 4,
  RESIDENCE_CARD: 5,
  NUMBER_CARD: 6,
}

export const KYC_STATUS = {
  ACCEPT: 1,
  REJECT: 2,
  PENDING: 3,
  APPROVED_PAPER: 4,
  NEW: 5,
  AUTO_KYC_PROCESSED: 7,
  PENDING_PAPER: 8,
}

export const USER_INFO_STATUS = {
  UPDATED: 1,
  NOT_UPDATED: 2,
}

export const ORDER_TYPE_LABEL = {
  [OrderType.Buy]: 'buy',
  [OrderType.Sell]: 'sell',
}

export const USER_CONDITION_TYPES = {
  kyc_verify_status: {
    type: 'string',
    original: 'number',
    display: 'enum',
    options: USER_KYC_VERIFY_STATUS,
  },
  user_info_status: {
    type: 'string',
    original: 'number',
    display: 'enum',
    options: USER_INFO_STATUS,
  },
  authenticator_verify_status: {
    type: 'string',
    original: 'number',
    display: 'enum',
    options: USER_AUTHENTICATOR_VERIFY_STATUS,
  },
  email_verify_status: {
    type: 'string',
    original: 'number',
    display: 'enum',
    options: USER_EMAIL_VERIFY_STATUS,
  },
  // referrer_code: {
  //   type: 'string',
  //   original: 'number',
  //   display: 'string',
  // },
  account_lv: {
    type: 'number',
    original: 'number',
    display: 'enum',
    options: USER_ACCOUNT_LV_OPTIONS,
  },
  channel_id: {
    type: 'number',
    original: 'number',
    display: 'number',
  },
  id: {
    type: 'number',
    original: 'number',
    display: 'number',
    label: 'User ID',
  },
}
/**
 * DO NOT REMOVE ANY PROPERTY 'TYPE' OR 'ORIGINAL' IN BELOW CONSTANT.
 * EVERY ACTION TO REMOVE WILL BE MAKE CRITICAL IN WORKER WHEN RUNNING
 */
export const INFO_EVENTS = [
  {
    eventName: EVENTS.AUTH_USER_CREATED,
    properties: [
      // uuid,last_login,referrer_code,email,email_verify_at,created_at,updated_at,id,status,type,email_verify_status,' +
      //     'authenticator_verify_status,kyc_verify_status,referred_by_id
      // {
      //   key: 'uuid',
      //   type: 'string',
      //   description: 'User UUID',
      // },
      {
        key: 'last_login',
        type: 'unix_timestamp',
        description: 'Last login time',
      },
      // {
      //   key: 'referrer_code',
      //   type: 'string',
      //   description: 'Referer code of user',
      // },
      {
        key: 'email',
        type: 'string',
        description: 'Account Email',
      },
      {
        key: 'email_verify_at',
        type: 'unix_timestamp',
        description: 'Email verify status',
      },
      {
        key: 'created_at',
        type: 'unix_timestamp',
        description: 'Account created at',
      },
      {
        key: 'updated_at',
        type: 'unix_timestamp',
        description: 'Account updated at',
      },
      {
        key: 'id',
        type: 'string',
        original: 'number',
        display: 'number',
        description: 'User ID',
      },
      {
        key: 'status',
        type: 'number',
        description: 'Account status',
        original: 'number',
        display: 'enum',
        options: USER_STATUS,
      },
      {
        key: 'type',
        type: 'number',
        description: 'Account type',
        original: 'number',
        display: 'enum',
        options: USER_TYPE,
      },
      {
        key: 'email_verify_status',
        type: 'number',
        description: 'Email verify status',
        original: 'number',
        display: 'enum',
        options: USER_EMAIL_VERIFY_STATUS,
      },
      // {
      //   key: 'authenticator_verify_status',
      //   type: 'number',
      //   description: 'Authenticator verify status',
      //   original: 'number',
      //   display: 'enum',
      //   options: USER_AUTHENTICATOR_VERIFY_STATUS,
      // },
      // {
      //   key: 'kyc_verify_status',
      //   type: 'number',
      //   description: 'KYC verify status',
      //   original: 'number',
      //   display: 'enum',
      //   options: USER_KYC_VERIFY_STATUS,
      // },
      {
        key: 'referred_by_id',
        type: 'number',
        description: 'Referred by user id',
      },
      {
        key: 'channel_id',
        type: 'number',
        description: 'Channel ID',
      },
    ],
  },
  {
    eventName: EVENTS.AUTH_USER_CHANGE_EMAIL,
    properties: [
      //user_id,old_email,new_email
      {
        key: 'user_id',
        type: 'string',
        original: 'number',
        display: 'number',
        description: 'User ID',
      },
      {
        key: 'old_email',
        type: 'string',
        description: 'Old Email',
      },
      {
        key: 'new_email',
        type: 'string',
        description: 'New Email',
      },
    ],
  },
  {
    eventName: EVENTS.AUTH_USER_LOGIN,
    properties: [
      //user_id,lang,ip,is_register,time
      {
        key: 'user_id',
        type: 'string',
        original: 'number',
        display: 'number',
        description: 'ID of user who just logged in',
      },
      // {
      //   key: 'lang',
      //   type: 'string',
      //   description: 'Language of user (en/ja)',
      // },
      {
        key: 'ip',
        type: 'string',
        description: 'IP address',
      },
      {
        key: 'is_register',
        type: 'boolean',
        description: 'Is brand new account?',
      },
      {
        key: 'time',
        type: 'unix_timestamp',
        description: 'Register time (unix timestamp)',
      },
    ],
  },
  {
    eventName: EVENTS.AUTH_USER_LOGOUT,
    properties: [
      //user_id,device_id,time
      {
        key: 'user_id',
        type: 'string',
        original: 'number',
        display: 'number',
        description: 'User ID',
      },
      {
        key: 'device_id',
        type: 'string',
        original: 'number',
        display: 'number',
        description: 'Device ID',
      },
      {
        key: 'time',
        type: 'unix_timestamp',
        description: 'Logout time',
      },
    ],
  },
  {
    eventName: EVENTS.AUTH_USER_CHANGE_PASSWORD,
    properties: [
      //user_id
      {
        key: 'user_id',
        type: 'string',
        original: 'number',
        display: 'number',
        description: 'User ID',
      },
    ],
  },
  {
    eventName: EVENTS.AUTH_USER_AUTHENTICATOR_STATUS_UPDATED,
    properties: [
      //status,user_id,otp_secret
      {
        key: 'user_id',
        type: 'string',
        original: 'number',
        display: 'number',
        description: 'User ID',
      },
      {
        key: 'status',
        type: 'number',
        description: 'Status',
        original: 'number',
        display: 'enum',
        options: USER_AUTHENTICATOR_VERIFY_STATUS,
      },
    ],
  },
  {
    eventName: EVENTS.AUTH_USER_KYC_STATUS_UPDATED,
    properties: [
      // status, user_id
      {
        key: 'status',
        type: 'number',
        description: 'Status',
        original: 'number',
        display: 'enum',
        options: KYC_STATUS,
      },
      {
        key: 'user_id',
        type: 'string',
        original: 'number',
        display: 'number',
        description: 'User ID',
      },
    ],
  },
  {
    eventName: EVENTS.AUTH_USER_KYC_REGISTERED,
    properties: [
      {
        key: 'id',
        type: 'string',
        original: 'number',
        display: 'number',
        description: 'ID',
      },
      {
        key: 'user_id',
        type: 'string',
        original: 'number',
        display: 'number',
        description: 'User ID',
      },
      {
        key: 'type',
        type: 'number',
        description: 'Type',
        original: 'number',
        display: 'enum',
        options: KYC_TYPE,
      },
      {
        key: 'provider',
        type: 'number',
        description: 'KYC Provider ID',
      },
      {
        key: 'id_document_type',
        type: 'number',
        description: 'Document type ID',
        original: 'number',
        display: 'enum',
        options: KYC_ID_DOCUMENT_TYPE,
      },
      {
        key: 'country_id',
        type: 'number',
        description: 'Country ID (get list from setting v2 API)',
      },
      // {
      //   key: 'user_kyc_history_id',
      //   type: 'string',
      //   original: 'number',
      //   display: 'number',
      //   description: 'KYC history id',
      // },
      // {
      //   key: 'status',
      //   type: 'number',
      //   description: 'Status',
      //   original: 'number',
      //   display: 'enum',
      //   options: KYC_STATUS,
      // },
      // {
      //   key: 'cynopsis_processing',
      //   type: 'boolean',
      //   description: 'Is Cynopsis processing',
      // },
      // {
      //   key: 'created_at',
      //   type: 'unix_timestamp',
      //   description: 'Created at (unix time)',
      // },
      // {
      //   key: 'updated_at',
      //   type: 'unix_timestamp',
      //   description: 'Updated at (unix time)',
      // },
    ],
  },
  {
    eventName: EVENTS.AUTH_USER_KYC_AUTO_KYC_FINISHED,
    properties: [
      {
        key: 'user_id',
        type: 'string',
        original: 'number',
        display: 'number',
        description: 'User ID',
      },
      {
        key: 'pass',
        type: 'boolean',
        description: 'Is passed Auto KYC',
      },
    ],
  },
  {
    eventName: EVENTS.AUTH_USER_CHANGE_LV,
    properties: [
      {
        key: 'user_id',
        type: 'string',
        original: 'number',
        display: 'number',
        description: 'User ID',
      },
      {
        key: 'old_level',
        type: 'number',
        original: 'number',
        display: 'enum',
        options: USER_ACCOUNT_LV_OPTIONS,
        description: 'Account level before change',
      },
      {
        key: 'new_level',
        type: 'number',
        original: 'number',
        display: 'enum',
        options: USER_ACCOUNT_LV_OPTIONS,
        description: 'Account level after change',
      },
    ],
  },
  {
    eventName: EVENTS.AUTH_USER_CHANGE_INFO,
    properties: [
      //user_id
      {
        key: 'user_id',
        type: 'string',
        original: 'number',
        display: 'number',
        description: 'User ID',
      },
    ],
  },

  // {
  //   eventName: EVENTS.BCE_TRADING_MATCHED,
  //   properties: [
  //     {
  //       key: 'trade_type',
  //       type: 'string',
  //       description: 'Trade Type',
  //     },
  //     {
  //       key: 'user_id',
  //       type: 'string',
  //       original: 'number',
  //       display: 'number',
  //       description: 'User ID',
  //     },
  //     {
  //       key: 'currency',
  //       type: 'string',
  //       description: 'Currency',
  //     },
  //     {
  //       key: 'coin',
  //       type: 'string',
  //       description: 'Coin',
  //     },
  //     {
  //       key: 'quantity',
  //       type: 'string',
  //       original: 'number',
  //       display: 'number',
  //       description: 'Quantity',
  //     },
  //     {
  //       key: 'is_first_time',
  //       type: 'boolean',
  //       description: 'Is First Time',
  //     },
  //   ],
  // },

  {
    eventName: EVENTS.EXCHANGE_CONFIRM_ORDER_MATCH,
    properties: [
      {
        key: 'trade_type',
        type: 'string',
        description: 'Trade Type',
      },
      {
        key: 'user_id',
        type: 'string',
        original: 'number',
        display: 'number',
        description: 'User ID',
      },
      {
        key: 'currency',
        type: 'string',
        description: 'Currency',
      },
      {
        key: 'coin',
        type: 'string',
        description: 'Coin',
      },
      {
        key: 'quantity',
        type: 'string',
        original: 'number',
        display: 'number',
        description: 'Quantity',
      },
    ],
  },

  {
    eventName: EVENTS.BCE_DEPOSIT,
    properties: [
      //id,transaction_id, user_id, type, currency, amount, fee, is_first_time
      {
        key: 'id',
        type: 'string',
        description: 'ID',
      },
      {
        key: 'transaction_id',
        type: 'string',
        description: 'Transaction ID',
      },
      {
        key: 'user_id',
        type: 'string',
        original: 'number',
        display: 'number',
        description: 'User ID',
      },
      {
        key: 'type',
        type: 'string',
        description: 'Type of transaction (values: deposit, ...?)',
      },
      {
        key: 'currency',
        type: 'string',
        description: 'Currency (lowercase)',
      },
      {
        key: 'amount',
        type: 'string', // Type khi gửi về từ kafka là string, nhưng bản chất là giá trị là number
        original: 'number',
        display: 'number',
        description: 'Amount',
      },
      {
        key: 'fee',
        type: 'string', // Type khi gửi về từ kafka là string, nhưng bản chất là giá trị là number
        original: 'number',
        display: 'number',
        description: 'Fee',
      },
      {
        key: 'is_missing_event',
        type: 'boolean',
        description: 'Is this is event is missed and re-pushed manually',
      },
      {
        key: 'is_first_time',
        type: 'boolean',
        description: 'Is first time the use do this action',
      },
      {
        key: 'created_at',
        type: 'string',
        original: 'number',
        display: 'number',
        description: 'Deposit time',
      },
    ],
  },
  // Kafka chưa có event này (update 27/03/2022)
  // {
  //   eventName: EVENTS.BCE_WITHDRAW,
  //   properties: [
  //     //id,transaction_id, user_id, type, currency, amount, fee, is_first_time
  //     {
  //       key: 'id',
  //       type: 'number',
  //       description: 'ID',
  //     },
  //     {
  //       key: 'transaction_id',
  //       type: 'string',
  //       description: 'Transaction ID',
  //     },
  //     {
  //       key: 'user_id',
  //       type: 'string',
  //       original: 'number',
  //       display: 'number',
  //       description: 'User ID',
  //     },
  //     {
  //       key: 'type',
  //       type: 'string',
  //       description: 'Type',
  //     },
  //     {
  //       key: 'currency',
  //       type: 'string',
  //       description: 'Currency (lowercase)',
  //     },
  //     {
  //       key: 'amount',
  //       type: 'string',
  //       original: 'number',
  //       display: 'number',
  //       description: 'Amount',
  //     },
  //     {
  //       key: 'fee',
  //       type: 'string',
  //       original: 'number',
  //       display: 'number',
  //       description: 'Fee',
  //     },
  //     {
  //       key: 'is_first_time',
  //       type: 'boolean',
  //       description: 'Is first time the user do this action',
  //     },
  //   ],
  // },
  {
    eventName: EVENTS.HIGH_LOW_TRANSFER_BALANCE,
    properties: [
      {
        key: 'id',
        type: 'string',
        original: 'number',
        display: 'number',
        description: 'Transfer ID',
      },
      {
        key: 'user_id',
        type: 'string',
        original: 'number',
        display: 'number',
        description: 'User ID',
      },
      {
        key: 'currency',
        type: 'string',
        description: 'Currency (lowercase)',
      },
      {
        key: 'type',
        type: 'string',
        description: 'Type (EXCHANGE or BO)',
      },
      {
        key: 'transfer_amount',
        type: 'string',
        original: 'number',
        display: 'number',
        description: 'Transfer amount',
      },
    ],
  },
  {
    eventName: EVENTS.HIGH_LOW_CREATE,
    properties: [
      {
        key: 'user_id',
        type: 'string',
        original: 'number',
        display: 'number',
        description: 'User ID',
      },
      {
        key: 'balance_id',
        type: 'number',
        description: 'Balance ID',
      },
      {
        key: 'mode_id',
        type: 'number',
        description: 'Mode ID',
      },
      {
        key: 'strike',
        type: 'number',
        description: 'Strike',
      },
      {
        key: 'trade_type',
        type: 'string',
        description: 'Trade Type',
      },
      {
        key: 'pair_id',
        type: 'number',
        description: 'Pair ID',
      },
      {
        key: 'invest',
        type: 'number',
        description: 'Invest',
      },
      {
        key: 'start_time',
        type: 'string',
        description: 'Start Time',
      },
      {
        key: 'end_time',
        type: 'string',
        description: 'End Time',
      },
      {
        key: 'buy_time',
        type: 'string',
        original: 'unix_timestamp',
        display: 'unix_timestamp',
        description: 'Buy Time',
      },
      {
        key: 'expire_time',
        type: 'string',
        original: 'unix_timestamp',
        display: 'unix_timestamp',
        description: 'Expire Time',
      },
      {
        key: 'payout',
        type: 'number',
        description: 'Payout',
      },
      {
        key: 'expire_payout',
        type: 'number',
        description: 'Expire Payout',
      },
      {
        key: 'profit',
        type: 'number',
        description: 'Profit',
      },
      {
        key: 'bcast_use',
        type: 'number',
        description: 'Bcast Use',
      },
      {
        key: 'buy_payout',
        type: 'number',
        description: 'Buy Payout',
      },
      {
        key: 'rank_payout',
        type: 'number',
        description: 'Rank Payout',
      },
      {
        key: 'decimal_part',
        type: 'number',
        description: 'Decimal Part',
      },
      {
        key: 'status',
        type: 'string',
        description: 'Status',
      },
      // {
      //   key: 'created_at',
      //   type: 'string',
      //   original: 'unix_timestamp',
      //   display: 'unix_timestamp',
      //   description: 'Created At',
      // },
      {
        key: 'allow_resell',
        type: 'number',
        description: 'Allow Resell',
      },
      {
        key: 'resell_expire',
        type: 'string',
        original: 'unix_timestamp',
        display: 'unix_timestamp',
        description: 'Resell Expire',
      },
      {
        key: 'odds_mode',
        type: 'number',
        description: 'Odds Mode',
      },
      {
        key: 'odds_fee',
        type: 'number',
        description: 'Odds Fee',
      },
      {
        key: 'pair_index',
        type: 'number',
        description: 'Pair Index',
      },
      {
        key: 'frame_active',
        type: 'string',
        description: 'Frame Active',
      },
      {
        key: 'is_demo',
        type: 'number',
        description: 'Is Demo',
      },
      {
        key: 'closing_rate',
        type: 'number',
        description: 'Closing Rate',
      },
      {
        key: 'sell_payout',
        type: 'number',
        description: 'Sell Payout',
      },
      // {
      //   key: 'updated_at',
      //   type: 'string',
      //   original: 'unix_timestamp',
      //   display: 'unix_timestamp',
      //   description: 'Updated At',
      // },
      {
        key: 'id',
        type: 'number',
        description: 'ID',
      },
      {
        key: 'is_first_time',
        type: 'boolean',
        description: 'Is First Time',
      },
    ],
  },
  {
    eventName: EVENTS.HIGH_LOW_LOSE,
    properties: [
      {
        key: 'user_id',
        type: 'string',
        original: 'number',
        display: 'number',
        description: 'User ID',
      },
      {
        key: 'balance_id',
        type: 'number',
        description: 'Balance ID',
      },
      {
        key: 'mode_id',
        type: 'number',
        description: 'Mode ID',
      },
      {
        key: 'strike',
        type: 'number',
        description: 'Strike',
      },
      {
        key: 'trade_type',
        type: 'string',
        description: 'Trade Type',
      },
      {
        key: 'pair_id',
        type: 'number',
        description: 'Pair ID',
      },
      {
        key: 'invest',
        type: 'number',
        description: 'Invest',
      },
      {
        key: 'start_time',
        type: 'string',
        description: 'Start Time',
      },
      {
        key: 'end_time',
        type: 'string',
        description: 'End Time',
      },
      {
        key: 'buy_time',
        type: 'string',
        original: 'unix_timestamp',
        display: 'unix_timestamp',
        description: 'Buy Time',
      },
      {
        key: 'expire_time',
        type: 'string',
        original: 'unix_timestamp',
        display: 'unix_timestamp',
        description: 'Expire Time',
      },
      {
        key: 'payout',
        type: 'number',
        description: 'Payout',
      },
      {
        key: 'expire_payout',
        type: 'number',
        description: 'Expire Payout',
      },
      {
        key: 'profit',
        type: 'number',
        description: 'Profit',
      },
      {
        key: 'bcast_use',
        type: 'number',
        description: 'Bcast Use',
      },
      {
        key: 'buy_payout',
        type: 'number',
        description: 'Buy Payout',
      },
      {
        key: 'rank_payout',
        type: 'number',
        description: 'Rank Payout',
      },
      {
        key: 'decimal_part',
        type: 'number',
        description: 'Decimal Part',
      },
      {
        key: 'status',
        type: 'string',
        description: 'Status',
      },
      // {
      //   key: 'created_at',
      //   type: 'string',
      //   original: 'unix_timestamp',
      //   display: 'unix_timestamp',
      //   description: 'Created At',
      // },
      {
        key: 'allow_resell',
        type: 'number',
        description: 'Allow Resell',
      },
      {
        key: 'resell_expire',
        type: 'string',
        original: 'unix_timestamp',
        display: 'unix_timestamp',
        description: 'Resell Expire',
      },
      {
        key: 'odds_mode',
        type: 'number',
        description: 'Odds Mode',
      },
      {
        key: 'odds_fee',
        type: 'number',
        description: 'Odds Fee',
      },
      {
        key: 'pair_index',
        type: 'number',
        description: 'Pair Index',
      },
      {
        key: 'frame_active',
        type: 'string',
        description: 'Frame Active',
      },
      {
        key: 'is_demo',
        type: 'number',
        description: 'Is Demo',
      },
      {
        key: 'closing_rate',
        type: 'number',
        description: 'Closing Rate',
      },
      {
        key: 'sell_payout',
        type: 'number',
        description: 'Sell Payout',
      },
      // {
      //   key: 'updated_at',
      //   type: 'string',
      //   original: 'unix_timestamp',
      //   display: 'unix_timestamp',
      //   description: 'Updated At',
      // },
      {
        key: 'id',
        type: 'number',
        description: 'ID',
      },
      {
        key: 'is_first_time',
        type: 'boolean',
        description: 'Is First Time',
      },
    ],
  },
  {
    eventName: EVENTS.HIGH_LOW_CANCEL,
    properties: [
      {
        key: 'user_id',
        type: 'string',
        original: 'number',
        display: 'number',
        description: 'User ID',
      },
      {
        key: 'balance_id',
        type: 'number',
        description: 'Balance ID',
      },
      {
        key: 'mode_id',
        type: 'number',
        description: 'Mode ID',
      },
      {
        key: 'strike',
        type: 'number',
        description: 'Strike',
      },
      {
        key: 'trade_type',
        type: 'string',
        description: 'Trade Type',
      },
      {
        key: 'pair_id',
        type: 'number',
        description: 'Pair ID',
      },
      {
        key: 'invest',
        type: 'number',
        description: 'Invest',
      },
      {
        key: 'start_time',
        type: 'string',
        description: 'Start Time',
      },
      {
        key: 'end_time',
        type: 'string',
        description: 'End Time',
      },
      {
        key: 'buy_time',
        type: 'string',
        original: 'unix_timestamp',
        display: 'unix_timestamp',
        description: 'Buy Time',
      },
      {
        key: 'expire_time',
        type: 'string',
        original: 'unix_timestamp',
        display: 'unix_timestamp',
        description: 'Expire Time',
      },
      {
        key: 'payout',
        type: 'number',
        description: 'Payout',
      },
      {
        key: 'expire_payout',
        type: 'number',
        description: 'Expire Payout',
      },
      {
        key: 'profit',
        type: 'number',
        description: 'Profit',
      },
      {
        key: 'bcast_use',
        type: 'number',
        description: 'Bcast Use',
      },
      {
        key: 'buy_payout',
        type: 'number',
        description: 'Buy Payout',
      },
      {
        key: 'rank_payout',
        type: 'number',
        description: 'Rank Payout',
      },
      {
        key: 'decimal_part',
        type: 'number',
        description: 'Decimal Part',
      },
      {
        key: 'status',
        type: 'string',
        description: 'Status',
      },
      // {
      //   key: 'created_at',
      //   type: 'string',
      //   original: 'unix_timestamp',
      //   display: 'unix_timestamp',
      //   description: 'Created At',
      // },
      {
        key: 'allow_resell',
        type: 'number',
        description: 'Allow Resell',
      },
      {
        key: 'resell_expire',
        type: 'string',
        original: 'unix_timestamp',
        display: 'unix_timestamp',
        description: 'Resell Expire',
      },
      {
        key: 'odds_mode',
        type: 'number',
        description: 'Odds Mode',
      },
      {
        key: 'odds_fee',
        type: 'number',
        description: 'Odds Fee',
      },
      {
        key: 'pair_index',
        type: 'number',
        description: 'Pair Index',
      },
      {
        key: 'frame_active',
        type: 'string',
        description: 'Frame Active',
      },
      {
        key: 'is_demo',
        type: 'number',
        description: 'Is Demo',
      },
      {
        key: 'closing_rate',
        type: 'number',
        description: 'Closing Rate',
      },
      {
        key: 'sell_payout',
        type: 'number',
        description: 'Sell Payout',
      },
      // {
      //   key: 'updated_at',
      //   type: 'string',
      //   original: 'unix_timestamp',
      //   display: 'unix_timestamp',
      //   description: 'Updated At',
      // },
      {
        key: 'id',
        type: 'number',
        description: 'ID',
      },
      {
        key: 'is_first_time',
        type: 'boolean',
        description: 'Is First Time',
      },
    ],
  },
  {
    eventName: EVENTS.HIGH_LOW_WIN,
    properties: [
      {
        key: 'user_id',
        type: 'string',
        original: 'number',
        display: 'number',
        description: 'User ID',
      },
      {
        key: 'balance_id',
        type: 'number',
        description: 'Balance ID',
      },
      {
        key: 'mode_id',
        type: 'number',
        description: 'Mode ID',
      },
      {
        key: 'strike',
        type: 'number',
        description: 'Strike',
      },
      {
        key: 'trade_type',
        type: 'string',
        description: 'Trade Type',
      },
      {
        key: 'pair_id',
        type: 'number',
        description: 'Pair ID',
      },
      {
        key: 'invest',
        type: 'number',
        description: 'Invest',
      },
      {
        key: 'start_time',
        type: 'string',
        description: 'Start Time',
      },
      {
        key: 'end_time',
        type: 'string',
        description: 'End Time',
      },
      {
        key: 'buy_time',
        type: 'string',
        original: 'unix_timestamp',
        display: 'unix_timestamp',
        description: 'Buy Time',
      },
      {
        key: 'expire_time',
        type: 'string',
        original: 'unix_timestamp',
        display: 'unix_timestamp',
        description: 'Expire Time',
      },
      {
        key: 'payout',
        type: 'number',
        description: 'Payout',
      },
      {
        key: 'expire_payout',
        type: 'number',
        description: 'Expire Payout',
      },
      {
        key: 'profit',
        type: 'number',
        description: 'Profit',
      },
      {
        key: 'bcast_use',
        type: 'number',
        description: 'Bcast Use',
      },
      {
        key: 'buy_payout',
        type: 'number',
        description: 'Buy Payout',
      },
      {
        key: 'rank_payout',
        type: 'number',
        description: 'Rank Payout',
      },
      {
        key: 'decimal_part',
        type: 'number',
        description: 'Decimal Part',
      },
      {
        key: 'status',
        type: 'string',
        description: 'Status',
      },
      // {
      //   key: 'created_at',
      //   type: 'string',
      //   original: 'unix_timestamp',
      //   display: 'unix_timestamp',
      //   description: 'Created At',
      // },
      {
        key: 'allow_resell',
        type: 'number',
        description: 'Allow Resell',
      },
      {
        key: 'resell_expire',
        type: 'string',
        original: 'unix_timestamp',
        display: 'unix_timestamp',
        description: 'Resell Expire',
      },
      {
        key: 'odds_mode',
        type: 'number',
        description: 'Odds Mode',
      },
      {
        key: 'odds_fee',
        type: 'number',
        description: 'Odds Fee',
      },
      {
        key: 'pair_index',
        type: 'number',
        description: 'Pair Index',
      },
      {
        key: 'frame_active',
        type: 'string',
        description: 'Frame Active',
      },
      {
        key: 'is_demo',
        type: 'number',
        description: 'Is Demo',
      },
      {
        key: 'closing_rate',
        type: 'number',
        description: 'Closing Rate',
      },
      {
        key: 'sell_payout',
        type: 'number',
        description: 'Sell Payout',
      },
      // {
      //   key: 'updated_at',
      //   type: 'string',
      //   original: 'unix_timestamp',
      //   display: 'unix_timestamp',
      //   description: 'Updated At',
      // },
      {
        key: 'id',
        type: 'number',
        description: 'ID',
      },
      {
        key: 'is_first_time',
        type: 'boolean',
        description: 'Is First Time',
      },
    ],
  },
  {
    eventName: EVENTS.REWARD_USER_CHECK_IN,
    properties: [
      {
        key: 'created_at',
        type: 'number',
        description: 'Checkin time',
      },
      {
        key: 'user_id',
        type: 'number',
        description: 'User id',
      },
    ],
  },
]

export const LIST_GRANT_METHODS = [
  {
    key: GRANT_METHOD.FIXED,
    value: 'Fixed',
  },
  {
    key: GRANT_METHOD.PERCENT,
    value: 'In Percent',
  },
]

export const LIST_GRANT_TARGET_USERS = [
  {
    key: GRANT_TARGET_USER.USER,
    value: 'User',
  },
  {
    key: GRANT_TARGET_USER.REFERRAL_USER,
    value: 'Referral User',
  },
]

export const LIST_PROPERTY_TO_CALCULATE_AMOUNT = [
  {
    key: PROPERTY_TO_CALCULATE_AMOUNT.INVEST,
    value: 'invest',
  },
]

// TODO: wallet saved in mission and mission_user_logs table are different. Fix after 16/11 release
export const LIST_GRANT_TARGET_WALLETS = () => {
  return Object.keys(DELIVERY_METHOD_WALLET)
    .filter((key) =>
      [
        DELIVERY_METHOD_WALLET.DIRECT_BALANCE,
        DELIVERY_METHOD_WALLET.DIRECT_CASHBACK,
        DELIVERY_METHOD_WALLET.DIRECT_REWARD,
        // DELIVERY_METHOD_WALLET.REWARD_BALANCE,
        // DELIVERY_METHOD_WALLET.REWARD_CASHBACK,
      ].includes(DELIVERY_METHOD_WALLET[key]),
    )
    .map((key) => {
      return {
        key,
        value: DELIVERY_METHOD_WALLET[key]
          .replace(/_/g, ' ')
          .toUpperCase()
          .replace('DIRECT ', ''),
      }
    })
}
