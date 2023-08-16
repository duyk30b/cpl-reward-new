import { MissionService } from '@lib/grpc-client/mission'
import { Injectable } from '@nestjs/common'
import { CreateMissionDto } from './dto/create-mission.dto'
import { GetMissionsDto } from './dto/get-mission.dto'
import { UpdateMissionDto } from './dto/update-mission.dto'

@Injectable()
export class ApiMissionService {
  constructor(private readonly missionService: MissionService) {}

  async create(dto: CreateMissionDto) {
    return await this.missionService.create(dto)
  }

  async update(id: number, dto: UpdateMissionDto) {
    dto.id = id
    return await this.missionService.update(dto)
  }

  async findOne(id: number) {
    return await this.missionService.findOne(id)
  }

  async getMissions(filter: GetMissionsDto) {
    return await this.missionService.getMissionsByCampaign({
      campaignId: filter.campaignId,
    })
  }
}
