import { BullQueueService, IFilterMission, QUEUE_EVENT } from '@lib/redis'
import { Mission } from '@libs/typeorm/mission'
import { OnQueueFailed, Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { WorkerFilterMissionService } from './worker-filter-mission.service'

@Processor(QUEUE_EVENT.FILTER_MISSION)
export class WorkerFilterMissionProcessor {
  private readonly logger = new Logger(WorkerFilterMissionProcessor.name)

  constructor(
    private readonly bullQueueService: BullQueueService,
    private readonly workerFilterMissionService: WorkerFilterMissionService,
  ) {}

  @Process()
  async handleProcess({ data }: Job<IFilterMission>) {
    this.logger.log(`[${data.messageId}] handleFilterMission: ${JSON.stringify(data)}`)
    const missions = await this.workerFilterMissionService.findMissionAvailable(data)
    const missionIds = missions.map((i) => i.id)
    this.logger.log(`[${data.messageId}] -- Mission filter by event: ${JSON.stringify(missionIds)}`)

    missions.forEach((mission: Mission) => {
      this.bullQueueService.addCheckConditionJob({
        groupKey: `${data.userId}_${mission.campaignId}`,
        messageId: data.messageId,
        userId: data.userId,
        eventName: data.eventName,
        data: data.data,
        missionId: mission.id,
        campaignId: mission.campaignId,
        createTime: data.createTime,
      })
    })
  }

  @OnQueueFailed()
  async handleFailed(job: Job, err: Error) {
    this.logger.error(`[${job.data.messageId}] handleFailed: ${err.message}`)
  }
}
