import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import {
  ICheckBudget,
  ICheckCondition,
  IFilterMission,
  IRewardTagUser,
  ISendReward,
} from './bull-queue.interface'
import { QUEUE_EVENT } from './bull-queue.variable'

@Injectable()
export class BullQueueService {
  constructor(
    @InjectQueue(QUEUE_EVENT.FILTER_MISSION)
    private readonly filterMissionQueue: Queue,
    @InjectQueue(QUEUE_EVENT.CHECK_CONDITION)
    private readonly checkConditionQueue: Queue,
    @InjectQueue(QUEUE_EVENT.CHECK_BUDGET)
    private readonly checkBudgetQueue: Queue,
    @InjectQueue(QUEUE_EVENT.SEND_REWARD)
    private readonly sendRewardQueue: Queue,
    @InjectQueue(QUEUE_EVENT.REWARD_TAG_USER)
    private readonly rewardTagUserQueue: Queue,
  ) {}

  async addFilterMissionJob(data: IFilterMission) {
    await this.filterMissionQueue.add(data)
  }

  async addCheckConditionJob(data: ICheckCondition) {
    await this.checkConditionQueue.add(data)
  }

  async addCheckBudgetJob(data: ICheckBudget) {
    await this.checkBudgetQueue.add(data)
  }

  async addSendReward(data: ISendReward) {
    await this.sendRewardQueue.add(data)
  }

  async addRewardTagUser(data: IRewardTagUser) {
    await this.rewardTagUserQueue.add(data)
  }
}
