import { Injectable, Logger } from '@nestjs/common'
import { ReasonCategoryService } from '@lib/grpc-client/reason/reason-category.service'
import {
  IBaseReasonCategoryResponse,
  ICreateReasonCategory,
  IReasonCategory,
  IReasonCategoryFilter,
} from '@lib/grpc-client/reason/interfaces/reason-category.interface'

@Injectable()
export class ApiReasonCategoryService {
  private logger = new Logger(ApiReasonCategoryService.name)

  constructor(private reasonCategoryService: ReasonCategoryService) {}

  async create(createReasonCategory: ICreateReasonCategory) {
    return await this.reasonCategoryService.create(createReasonCategory)
  }

  async findAll(reasonCategoryFilter: IReasonCategoryFilter) {
    return await this.reasonCategoryService.findAll(reasonCategoryFilter)
  }

  async findById(id: string): Promise<IReasonCategory> {
    return await this.reasonCategoryService.findById(id)
  }

  async update(
    reasonCategory: IReasonCategory,
  ): Promise<IBaseReasonCategoryResponse> {
    return await this.reasonCategoryService.update(reasonCategory)
  }

  async delete(id: string): Promise<IBaseReasonCategoryResponse> {
    return await this.reasonCategoryService.delete(id)
  }

  async getLanguage() {
    return await this.reasonCategoryService.getLanguage()
  }
}
