import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MissionEvent } from './mission-event.entity'

@Injectable()
export class MissionEventService {
  constructor(
    @InjectRepository(MissionEvent)
    private missionEventRepository: Repository<MissionEvent>,
  ) {}

  async findByEventName(eventName: string): Promise<MissionEvent[]> {
    return await this.missionEventRepository.find({
      where: { eventName },
    })
  }

  async saveOne(dto: Partial<MissionEvent>): Promise<MissionEvent> {
    const instance = this.missionEventRepository.create(dto)
    return this.missionEventRepository.save(instance)
  }

  async update(where: { missionId: number }, dto: Partial<MissionEvent>) {
    return this.missionEventRepository.update({ missionId: where.missionId }, dto)
  }
}
