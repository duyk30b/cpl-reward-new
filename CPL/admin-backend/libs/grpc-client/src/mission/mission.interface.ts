import { Observable } from 'rxjs'

export interface IGrpcAdminMissionService {
  getMissionsByCampaign(missionFilter: IMissionFilter): Observable<IListMission>
  create(input: ICreateInput): Observable<IMissionRes>
  update(input: IUpdateInput): Observable<IMissionRes>
  findOne({ id }: { id: number }): Observable<IMission>
}

export interface IMission {
  id: number
  campaignId: number
  title: string
  detailExplain: string
  titleJa: string
  detailExplainJa: string
  guideLinkJa: string
  openingDate: number
  closingDate: number
  rewardRules: IRewardRule[]
  judgmentConditions: IJudgmentCondition[]
  userConditions: IUserCondition[]
  displayConditions: IUserCondition[]
  grantTarget: IGrantTarget[]
  createdAt: string
  updatedAt: string
  priority: number
  guideLink: string
  limitReceivedReward: number
  status: number
}

export interface IMissionRes {
  message: string
  success: boolean
  mission: IMission
}

export interface IListMission {
  missions: Array<IMission>
}

export interface IRewardRuleInput {
  key: string
  currency: string
  limitValue: string
  typeRule?: string
}

export interface IRewardRule extends IRewardRuleInput {
  id: number
  releaseValue: number
  createdAt: string
  updatedAt: string
}

export interface IJudgmentCondition {
  eventName: string
  property: string
  operator: string
  value: string
  type: string
}

export interface IUserCondition {
  property: string
  operator: string
  value: string
  type: string
}

export interface IGrantTarget {
  user: string
  grantMethod: string
  amount: string
  propertyToCalculateAmount: string
  currency: string
  wallet: string
  tagIds: Array<number>
}

export interface IMissionFilter {
  campaignId: number
}

export interface ICreateInput {
  campaignId: number
  title: string
  detailExplain: string
  titleJa: string
  detailExplainJa: string
  guideLinkJa: string
  openingDate: number
  closingDate: number
  rewardRules: IRewardRuleInput[]
  judgmentConditions: IJudgmentCondition[]
  userConditions: IUserCondition[]
  displayConditions: IUserCondition[]
  grantTarget: IGrantTarget[]
  priority: number
  guideLink: string
  limitReceivedReward: number
}

export interface IUpdateInput extends ICreateInput {
  id?: number
}
