import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
import { IReasonService } from '@lib/grpc-client/reason/interfaces/reason-service.interface'
import { ReasonDto } from '../../../../apps/api/src/api-reason/reason/api-reason.dto'
import { plainToInstance } from 'class-transformer'
import {
  IBaseReasonResponse,
  ICreateReason,
  IReasonFilter,
} from '@lib/grpc-client/reason/interfaces/reason.interface'

@Injectable()
export class ReasonService {
  private gReasonService: IReasonService
  constructor(@Inject('REASON_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.gReasonService =
      this.client.getService<IReasonService>('ReasonService')
  }

  async create(createReason: ICreateReason) {
    return await lastValueFrom(this.gReasonService.create(createReason))
  }

  async findAll(reasonFilter: IReasonFilter) {
    const req = this.gReasonService.findAll(reasonFilter)
    const data = await lastValueFrom(req)
    data.data = (data.data || []).map((item) => {
      return plainToInstance(ReasonDto, item, { ignoreDecorators: true })
    })
    return data
  }

  async findById(id: string) {
    const result = await lastValueFrom(
      this.gReasonService.findById({
        id: id,
      }),
    )
    return plainToInstance(ReasonDto, result, { ignoreDecorators: true })
  }

  async update(reason: ReasonDto): Promise<IBaseReasonResponse> {
    return await lastValueFrom(this.gReasonService.update(reason))
  }

  async delete(id: string): Promise<IBaseReasonResponse> {
    return await lastValueFrom(
      this.gReasonService.delete({
        id: id,
      }),
    )
  }
}
