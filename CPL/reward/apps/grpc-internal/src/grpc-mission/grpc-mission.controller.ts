import { Mission } from '@libs/typeorm/mission'
import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { FindMissionRequest } from './grpc-mission.request'
import { GrpcMissionService } from './grpc-mission.service'

@Controller('campaign')
export class GrpcMissionController {
  constructor(private readonly grpcMissionService: GrpcMissionService) {}

  @GrpcMethod('GrpcAdminMissionService', 'GetMissionsByCampaign')
  async getMissionsByCampaign(request: FindMissionRequest) {
    const missions = await this.grpcMissionService.findManyBy(request)
    return { missions }
  }

  @GrpcMethod('GrpcAdminMissionService', 'FindOne')
  async findOne(request: { id: number }): Promise<Mission> {
    return await this.grpcMissionService.findOneBy({ id: +request.id })
  }

  @GrpcMethod('GrpcAdminMissionService', 'Create')
  async create(request: Mission) {
    return await this.grpcMissionService.createOne(request)
  }

  @GrpcMethod('GrpcAdminMissionService', 'Update')
  async update(request: Mission) {
    return await this.grpcMissionService.updateOne(request)
  }
}
