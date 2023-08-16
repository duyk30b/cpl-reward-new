import { WALLET } from '@libs/typeorm/common/enum'
import { Mission } from '@libs/typeorm/mission'
import { Expose } from 'class-transformer'

export enum CLAIM_STATUS {
  DONE = 1,
  AVAIL = 2,
  NEXT = 3,
}

export class MissionCheckin extends Mission {
  @Expose({ name: 'claim_status' })
  claimStatus: CLAIM_STATUS

  @Expose()
  wallet: WALLET

  @Expose()
  currency: string

  @Expose()
  amount: string

  static fromMission(mission: Mission): MissionCheckin {
    const instance = new MissionCheckin()
    Object.assign(instance, mission)

    const [target] = mission.grantTarget
    instance.wallet = target.wallet || WALLET.EXCHANGE
    instance.currency = target.currency
    instance.amount = target.amount.toString(10)

    delete instance.grantTarget
    delete instance.displayConditions
    delete instance.userConditions
    delete instance.judgmentConditions

    return instance
  }

  static fromMissions(missions: Mission[]): MissionCheckin[] {
    return missions.map((mission) => MissionCheckin.fromMission(mission))
  }
}
