import { Body, Controller } from '@nestjs/common'
import { ReasonCategoryService, ReasonService } from 'lib/reason'
import {
  ICreateReasonCategory,
  IReasonCategory,
  IReasonCategoryFilter,
  IReasonCategoryList,
} from 'lib/reason/interfaces/reason-category.interface'
import { ReasonCategoryEntity } from 'lib/reason/entities/reason-category.entity'
import { DeleteResult } from 'typeorm'
@Controller()
export class GrpcReasonCategoryService {
  constructor(
    private readonly reasonCategoryService: ReasonCategoryService,
    private readonly reasonService: ReasonService,
  ) {}
  async create(
    @Body() createReasonCategory: ICreateReasonCategory,
  ): Promise<ReasonCategoryEntity> {
    return await this.reasonCategoryService.create(createReasonCategory)
  }

  async findAll(
    reasonCategoryFilter: IReasonCategoryFilter,
  ): Promise<IReasonCategoryList> {
    const queryPaginateResult = await this.reasonCategoryService.findAll(
      reasonCategoryFilter,
    )
    const categories = queryPaginateResult.data

    const categoryIds = categories.map((category) => category.id)
    const reasons = await this.reasonService.findByCategoryIds(categoryIds)

    queryPaginateResult.data = categories.map((category) => {
      category.reasons = reasons.filter(
        (reason) => reason.categoryId === category.id,
      )
      return category
    })

    return queryPaginateResult
  }

  async findById(id: string): Promise<IReasonCategory> {
    return this.reasonCategoryService.findById(id)
  }

  async findByIds(ids: string[]): Promise<ReasonCategoryEntity[]> {
    return this.reasonCategoryService.findByIds(ids)
  }

  async update(reasonCategory: IReasonCategory): Promise<ReasonCategoryEntity> {
    return await this.reasonCategoryService.update(reasonCategory)
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.reasonCategoryService.delete(id)
  }
}
