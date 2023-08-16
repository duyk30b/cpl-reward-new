import { Body, Controller } from '@nestjs/common'
import { ReasonCategoryService, ReasonService } from 'lib/reason'
import {
  ICreateReason,
  IReason,
  IReasonFilter,
  IReasonList,
} from 'lib/reason/interfaces/reason.interface'
import { DeleteResult } from 'typeorm'

@Controller('Reason')
export class GrpcReasonService {
  constructor(
    private readonly reasonService: ReasonService,
    private readonly reasonCategoryService: ReasonCategoryService,
  ) {}

  async create(@Body() createRejectionReason: ICreateReason): Promise<IReason> {
    return await this.reasonService.create(createRejectionReason)
  }

  async findAll(reasonFilter: IReasonFilter): Promise<IReasonList> {
    const queryPaginateResult = await this.reasonService.findAll(reasonFilter)
    const reasons = queryPaginateResult.data

    const categoryIds = reasons.map((reason) => reason.categoryId)
    const categories = await this.reasonCategoryService.findByIds(categoryIds)

    queryPaginateResult.data = reasons.map((reason) => {
      const category = categories.find((cat) => cat.id === reason.categoryId)
      reason.category = category || null
      return reason
    })

    return queryPaginateResult

    // return this.reasonService.findAll(reasonFilter)
  }

  async findById(id: string): Promise<IReason> {
    return this.reasonService.findById(id)
  }

  async update(reason: IReason): Promise<IReason> {
    return this.reasonService.update(reason)
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.reasonService.delete(id)
  }

  async findByCategoryIds(ids: string[]): Promise<IReason[]> {
    return this.reasonService.findByCategoryIds(ids)
  }
}
