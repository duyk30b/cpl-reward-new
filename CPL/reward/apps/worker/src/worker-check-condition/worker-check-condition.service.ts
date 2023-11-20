import { ICheckCondition } from '@lib/redis'
import { CheckUserConditionService } from '@libs/check-user-condition'
import { checkJudgmentConditions, MissionService } from '@libs/typeorm/mission'
import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class WorkerCheckConditionService {
  private readonly logger = new Logger(WorkerCheckConditionService.name)

  constructor(
    private readonly missionService: MissionService,
    private readonly checkUserConditionService: CheckUserConditionService,
  ) {}

  async checkConditions(data: ICheckCondition): Promise<{ error?: string[]; pass: boolean }> {
    const mission = await this.missionService.findOneBy({ id: data.missionId })

    const checkJudgment = await checkJudgmentConditions(
      { ...data.data, eventName: data.eventName },
      mission.judgmentConditions,
    )
    if (!checkJudgment.pass) return checkJudgment

    const checkUser = await this.checkUserConditionService.checkUserConditions(
      data.userId,
      mission.userConditions,
    )
    if (!checkUser.pass) return checkUser
    return { pass: true }
  }
}
