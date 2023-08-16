export enum REWARD_HISTORY_STATUS {
  DEFAULT = 0,
  PENDING = 1,
  SUCCESS = 2,
  FAILED = 3,
}

export enum SortFieldRewardHistory {
  id = 'id',
  campaign_id = 'campaignId',
  mission_id = 'missionId',
  user_id = 'userId',
  user_type = 'userType',
  currency = 'currency',
  wallet = 'wallet',
  delivery_method = 'deliveryMethod',
  status = 'status',
  referrer_user_id = 'referrerUserId',
  created_at = 'createdAt',
}
