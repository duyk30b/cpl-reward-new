import { Mission } from '@libs/typeorm/mission'
import { MissionEvent } from '@libs/typeorm/mission-event'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class MissionEventSeed {
  constructor(
    @InjectRepository(Mission) private readonly missionRepository: Repository<Mission>,
    @InjectRepository(MissionEvent)
    private readonly missionEventRepository: Repository<MissionEvent>,
  ) {}

  async createForEachMission() {
    const missions = await this.missionRepository.find()

    const missionEventsDto: MissionEvent[] = []
    for (let i = 0; i < missions.length; i++) {
      const missionEvent = new MissionEvent()
      missionEvent.campaignId = missions[i].campaignId
      missionEvent.missionId = missions[i].id
      missionEvent.eventName = missions[i].judgmentConditions?.[0]?.eventName || ''

      missionEventsDto.push(missionEvent)
    }

    await this.missionEventRepository.save(missionEventsDto)
  }
}
