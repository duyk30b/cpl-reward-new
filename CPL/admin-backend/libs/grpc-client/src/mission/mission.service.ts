import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import {
  IGrpcAdminMissionService,
  IMissionFilter,
  ICreateInput,
  IUpdateInput,
} from './mission.interface'
import { lastValueFrom } from 'rxjs'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { Mission, ListMission } from './mission.dto'
import { TagService } from '@lib/grpc-client/tag'

@Injectable()
export class MissionService {
  private gMissionSrv: IGrpcAdminMissionService

  constructor(
    @Inject('MISSION_PACKAGE') private client: ClientGrpc,
    private readonly tagService: TagService,
  ) {}

  onModuleInit() {
    this.gMissionSrv = this.client.getService<IGrpcAdminMissionService>(
      'GrpcAdminMissionService',
    )
  }

  async create(input: ICreateInput) {
    const req = this.gMissionSrv.create(input)
    const res = await lastValueFrom(req)

    if (res.success) {
      const mission = plainToInstance(Mission, res.mission, {
        ignoreDecorators: true,
      })

      // Add tags for each grantTarget
      const missionTag = await this.tagService.createOne({
        name: 'mission_' + mission.id,
      })
      const campaignTag = await this.tagService.createOne({
        name: 'campaign_' + mission.campaignId,
      })

      // Auto add tags for each grantTarget
      if (mission && mission.grantTarget) {
        mission.grantTarget = mission.grantTarget.map((target) => {
          if (!target.tagIds) {
            target.tagIds = []
          }
          if (
            missionTag &&
            missionTag.data &&
            !target.tagIds.includes(missionTag.data.id)
          ) {
            target.tagIds.push(missionTag.data.id)
          }
          if (
            campaignTag &&
            campaignTag.data &&
            !target.tagIds.includes(campaignTag.data.id)
          ) {
            target.tagIds.push(campaignTag.data.id)
          }
          return target
        })
      }

      // Update onetime again to add new tags
      const reqUpdate = this.gMissionSrv.update(mission)
      const resUpdate = instanceToPlain(await lastValueFrom(reqUpdate))
      resUpdate.mission = instanceToPlain(
        plainToInstance(Mission, resUpdate.mission, {
          ignoreDecorators: true,
        }),
      )

      return resUpdate
    }

    return res
  }

  async update(input: IUpdateInput) {
    const req = this.gMissionSrv.update(input)
    const res = await lastValueFrom(req)

    const mission = plainToInstance(Mission, res.mission, {
      ignoreDecorators: true,
    })

    return {
      ...res,
      mission,
    }
  }

  async findOne(id: number) {
    const req = this.gMissionSrv.findOne({ id })
    const res = await lastValueFrom(req)

    return plainToInstance(Mission, res, { ignoreDecorators: true })
  }

  async getMissionsByCampaign(filter: IMissionFilter) {
    const req = this.gMissionSrv.getMissionsByCampaign(filter)
    const res = await lastValueFrom(req)

    return plainToInstance(ListMission, res, {
      ignoreDecorators: true,
      exposeDefaultValues: true,
    })
  }
}
