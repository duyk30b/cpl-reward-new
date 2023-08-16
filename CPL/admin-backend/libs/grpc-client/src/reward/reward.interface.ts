import { Expose, Type } from 'class-transformer'
import { Observable } from 'rxjs'

export interface IGrpcAdminCampaignService {
  create(campaign: Campaign): Observable<Campaign>
  cancel(cancelInput: CancelInput): Observable<CancelCampaignResult>
  findOne(filter: FindOneCampaignInput): Observable<Campaign>
  update(campaign: Campaign): Observable<UpdateCampaignResult>
  list(filter: CampaignFilter): Observable<ListCampaign>
  getMissingRewards(filter: MissingRewardFilter): Observable<ListMissingReward>
  updateRewardLog(
    input: UpdateRewardLogInput,
  ): Observable<UpdateRewardLogResult>
  countRewardLog(input: CountRewardLogInput): Observable<CountRewardLogResult>
}

export class FindOneCampaignInput {
  id: number
}

export class CancelInput {
  campaignId: number
}

export class Links {
  first: string
  previous: string
  next: string
  last: string
}

export class Pagination {
  total: number
  size: number
  page: number
  @Expose({ name: 'item_count' })
  itemCount: number
  @Expose({ name: 'total_pages' })
  totalPages: number
}

export class ListCampaign {
  @Type(() => Campaign)
  data: Campaign[]
  @Type(() => Links)
  links: Links
  @Type(() => Pagination)
  pagination: Pagination
  @Type(() => Price)
  prices = []
}

export class Price {
  @Expose()
  currency: string
  @Expose()
  price: string
}

export class RewardRule {
  @Expose({ name: 'created_at' })
  createdAt: number

  @Expose({ name: 'updated_at' })
  updatedAt: number

  @Expose()
  id: number

  @Expose()
  key: string

  @Expose()
  currency: string

  @Expose({ name: 'limit_value' })
  limitValue: string

  @Expose({ name: 'release_value' })
  releaseValue: number

  @Expose({ name: 'type_rule' })
  typeRule: string
}

export class CampaignFilter {
  @Expose()
  page: number
  @Expose()
  limit: number
  @Expose({ name: 'search_field' })
  searchField: string
  @Expose({ name: 'search_text' })
  searchText: string
  @Expose()
  sort: string
  @Expose({ name: 'sort_type' })
  sortType: 'ASC' | 'DESC'
}

export class Campaign {
  @Expose()
  id: number
  @Expose()
  title: string
  @Expose()
  description: string

  @Expose({ name: 'title_ja' })
  titleJa: string

  @Expose({ name: 'description_ja' })
  descriptionJa: string

  @Expose({ name: 'notification_link_ja' })
  notificationLinkJa: string

  @Expose({ name: 'campaign_image_ja' })
  campaignImageJa: string

  @Expose({ name: 'start_date' })
  startDate: number

  @Expose({ name: 'end_date' })
  endDate: number

  @Expose({ name: 'notification_link' })
  notificationLink: string

  @Expose({ name: 'campaign_image' })
  campaignImage: string

  @Expose()
  priority: number

  @Expose({ name: 'type' })
  type: number

  @Expose()
  status: number

  @Expose({ name: 'created_at' })
  createdAt: number

  @Expose({ name: 'updated_at' })
  updatedAt: number

  @Expose({ name: 'is_active' })
  isActive: number

  @Expose({ name: 'is_hidden' })
  isHidden: number

  @Expose({ name: 'reward_rules' })
  @Type(() => RewardRule)
  rewardRules: RewardRule[]

  @Expose({ name: 'reset_time' })
  resetTime: string

  @Expose({ name: 'is_lock' })
  isLock: number
}

export interface CancelCampaignResult {
  affected: number
}

export interface InitCampaignResult {
  id: number
}

export class CancelCampaignInput {
  @Expose({ name: 'campaign_id' })
  campaignId: number
}

export class CreateActionLogInput {
  @Expose({ name: 'admin_id' })
  adminId: number
  @Expose({ name: 'action_name' })
  actionName: string
  @Expose({ name: 'content_date' })
  contentData: string
}

export class CreateRewardRule {
  @Expose()
  key: string
  @Expose()
  currency: string
  @Expose({ name: 'limit_value' })
  limitValue: string
}

export class UpdateRewardRule extends CreateRewardRule {
  @Expose()
  id: number
}

export class MissingRewardFilter {
  limit: number
  page: number
  sort?: string
  sortType?: string
}

export class ListMissingReward {
  @Type(() => MissingReward)
  data: MissingReward[]

  pagination: Pagination
}

export class MissingReward {
  id: number

  @Expose({ name: 'campaign_id' })
  campaignId: number

  @Expose({ name: 'mission_id' })
  missionId: number

  @Expose({ name: 'user_id' })
  userId: number

  @Expose({ name: 'money_earned' })
  moneyEarned: string
  note: string
  currency: string

  @Expose({ name: 'user_type' })
  userType: string
  wallet = 'direct_balance'
  status: string

  @Expose({ name: 'created_at' })
  createdAt: number

  @Expose({ name: 'reference_id' })
  referenceId: string

  @Expose({ name: 'balance_response' })
  balanceResponse: string
}

export class UpdateRewardLogInput {
  @Expose()
  id: number

  @Expose()
  status: number
}

export class CountRewardLogInput {
  @Expose()
  status: number
  @Expose()
  fromTime?: number
  @Expose()
  toTime?: number
}

export class UpdateRewardLogResult {
  @Expose()
  success = false
}

export class CountRewardLogResult {
  @Expose()
  count = 0
}

export interface UpdateCampaignResult {
  success: boolean
  message: string
  campaign: Campaign
}

export default IGrpcAdminCampaignService
