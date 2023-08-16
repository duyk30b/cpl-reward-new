import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { IReasonCategoryService } from '@lib/grpc-client/reason/interfaces/reason-category-service.interface'
import { lastValueFrom } from 'rxjs'
import {
  IBaseReasonCategoryResponse,
  ICreateReasonCategory,
  IReasonCategory,
  IReasonCategoryFilter,
  IReasonCategoryList,
} from '@lib/grpc-client/reason/interfaces/reason-category.interface'
import { plainToInstance } from 'class-transformer'
import { ReasonCategoryDto } from '../../../../apps/api/src/api-reason/reason-category/api-reason-category.dto'

@Injectable()
export class ReasonCategoryService {
  private gReasonCategoryService: IReasonCategoryService
  constructor(@Inject('REASON_CATEGORY_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.gReasonCategoryService =
      this.client.getService<IReasonCategoryService>('ReasonCategoryService')
  }

  async create(
    createReasonCategory: ICreateReasonCategory,
  ): Promise<IBaseReasonCategoryResponse> {
    return await lastValueFrom(
      this.gReasonCategoryService.create(createReasonCategory),
    )
  }

  async findAll(
    reasonCategoryFilter: IReasonCategoryFilter,
  ): Promise<IReasonCategoryList> {
    const req = this.gReasonCategoryService.findAll(reasonCategoryFilter)
    const data = await lastValueFrom(req)
    data.data = (data.data || []).map((item) => {
      return plainToInstance(ReasonCategoryDto, item, {
        ignoreDecorators: true,
      })
    })
    return data
  }

  async findById(id: string): Promise<IReasonCategory> {
    return await lastValueFrom(
      this.gReasonCategoryService.findById({
        id: id,
      }),
    )
  }

  async update(
    reasonCategory: IReasonCategory,
  ): Promise<IBaseReasonCategoryResponse> {
    return await lastValueFrom(
      this.gReasonCategoryService.update(reasonCategory),
    )
  }

  async delete(id: string): Promise<IBaseReasonCategoryResponse> {
    return await lastValueFrom(
      this.gReasonCategoryService.delete({
        id: id,
      }),
    )
  }
  async getLanguage() {
    return await lastValueFrom(this.gReasonCategoryService.getLanguage({}))
  }
}
