import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
import IGrpcAdminCommonService from '@lib/grpc-client/reward/reward-common.interface'
import { plainToClass } from 'class-transformer'
import { ListEventsDto, UserConditionListDto } from './reward-common.dto'

@Injectable()
export class RewardCommonService {
  private gRewardCmSrv: IGrpcAdminCommonService
  constructor(@Inject('CAMPAIGN_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.gRewardCmSrv = this.client.getService<IGrpcAdminCommonService>(
      'GrpcAdminCommonService',
    )
  }

  async getAllEvents() {
    const res = await lastValueFrom(this.gRewardCmSrv.listEvents(null))

    return plainToClass(ListEventsDto, res).events
  }

  async getGrantTargets() {
    return await lastValueFrom(this.gRewardCmSrv.listGrantTarget(null))
  }

  async getUserConditions() {
    const res = await lastValueFrom(this.gRewardCmSrv.listUserConditions(null))

    return plainToClass(UserConditionListDto, res)
  }

  async getDisplayConditions() {
    const res = await lastValueFrom(
      this.gRewardCmSrv.listDisplayConditions(null),
    )

    return plainToClass(UserConditionListDto, res)
  }
}
