import { Campaign } from '@libs/typeorm/campaign'
import { TARGET_USER, WALLET } from '@libs/typeorm/common/enum'
import {
  GrantTarget,
  GRANT_METHOD,
  JudgmentCondition,
  Mission,
  MISSION_STATUS,
  TARGET_TYPE,
  UserCondition,
} from '@libs/typeorm/mission'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import BigNumber from 'bignumber.js'
import { Repository } from 'typeorm'

@Injectable()
export class MissionSeed {
  constructor(
    @InjectRepository(Campaign) private readonly campaignRepository: Repository<Campaign>,
    @InjectRepository(Mission) private readonly missionRepository: Repository<Mission>,
  ) {}

  async createForEachCampaign(number: number) {
    const campaigns = await this.campaignRepository.find()

    const missionsDto: Mission[] = []
    for (let i = 0; i < campaigns.length; i++) {
      for (let j = 0; j < number; j++) {
        const mission = new Mission()

        mission.campaignId = campaigns[i].id
        mission.title = campaigns[i].title + ' - Mission ' + j
        mission.titleJa = campaigns[i].title + ' - Mission ' + j
        mission.detailExplain = 'lorem'
        mission.detailExplainJa = 'lorem'
        mission.guideLink = 'https://localhost.vn'
        mission.guideLinkJa = 'https://localhost.vn'
        mission.openingDate = Math.ceil(new Date('2023-03-30T04:45:41.587Z').getTime() / 1000)
        mission.closingDate = Math.ceil(new Date('2028-09-10T04:45:41.587Z').getTime() / 1000)
        mission.priority = campaigns[i].priority * 1000 + j
        mission.limitReceivedReward = 1000
        mission.isActive = true
        mission.status = MISSION_STATUS.RUNNING
        mission.targetType = TARGET_TYPE.ONLY_MAIN

        const judgmentConditions = new JudgmentCondition()
        judgmentConditions.eventName = 'auth_user_login'
        judgmentConditions.property = 'ip'
        judgmentConditions.operator = '!='
        judgmentConditions.value = '00'
        mission.judgmentConditions = [judgmentConditions]

        const userConditions = new UserCondition()
        userConditions.property = 'authenticator_verify_status'
        userConditions.operator = '!='
        userConditions.value = '2'
        mission.userConditions = [userConditions]

        const displayConditions = new UserCondition()
        displayConditions.property = 'kyc_verify_status'
        displayConditions.operator = '!='
        displayConditions.value = '2'
        mission.displayConditions = [displayConditions]

        const grantTarget = new GrantTarget()
        grantTarget.userType = TARGET_USER.USER
        grantTarget.grantMethod = GRANT_METHOD.FIXED
        grantTarget.amount = new BigNumber(1.2)
        grantTarget.property = ''
        grantTarget.currency = 'USDT'
        grantTarget.wallet = WALLET.CASHBACK
        grantTarget.tagIds = []
        mission.grantTarget = [grantTarget]

        missionsDto.push(mission)
      }
    }
    await this.missionRepository.insert(missionsDto)
  }
}
