import { Body, Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import {
  IBaseReasonCategoryResponse,
  ICreateReasonCategory,
  IReasonCategory,
  IReasonCategoryFilter,
  IReasonCategoryId,
  IReasonCategoryList,
} from 'lib/reason/interfaces/reason-category.interface'
import { GrpcReasonCategoryService } from './grpc-reason-category.service'
import { reasonLanguages } from 'lib/reason/interfaces/json-name.interface'
import { GrpcReasonService } from '../reason/grpc-reason-service'

@Controller('ReasonCategory')
export class GrpcReasonCategoryController {
  constructor(
    private readonly grpcReasonCategoryService: GrpcReasonCategoryService,
    private readonly grpcReasonService: GrpcReasonService,
  ) {}

  @GrpcMethod('ReasonCategoryService')
  async create(
    @Body() createReasonCategory: ICreateReasonCategory,
  ): Promise<IBaseReasonCategoryResponse> {
    let success = true
    let message = null

    try {
      await this.grpcReasonCategoryService.create(createReasonCategory)
    } catch (e) {
      success = false
      message = e.message
    }

    return {
      success,
      message,
    }
  }

  @GrpcMethod('ReasonCategoryService')
  async findAll(
    reasonCategoryFilter: IReasonCategoryFilter,
  ): Promise<IReasonCategoryList> {
    return await this.grpcReasonCategoryService.findAll(reasonCategoryFilter)
  }

  @GrpcMethod('ReasonCategoryService')
  async findById(
    reasonCategoryId: IReasonCategoryId,
  ): Promise<IReasonCategory> {
    return this.grpcReasonCategoryService.findById(reasonCategoryId.id)
  }

  @GrpcMethod('ReasonCategoryService')
  async update(
    reasonCategory: IReasonCategory,
  ): Promise<IBaseReasonCategoryResponse> {
    let success = true
    let message = null

    try {
      await this.grpcReasonCategoryService.update(reasonCategory)
    } catch (e) {
      success = false
      message = e.message
    }

    return {
      success,
      message,
    }
  }

  @GrpcMethod('ReasonCategoryService')
  async delete(
    reasonCategoryId: IReasonCategoryId,
  ): Promise<IBaseReasonCategoryResponse> {
    let success = true
    let message = null

    try {
      const reasons = await this.grpcReasonService.findByCategoryIds([
        reasonCategoryId.id,
      ])

      if (reasons.length > 0) {
        success = false
        message = 'Category being linked to reason'
      } else {
        await this.grpcReasonCategoryService.delete(reasonCategoryId.id)
      }
    } catch (e) {
      success = false
      message = e.message
    }

    return {
      success,
      message,
    }
  }

  @GrpcMethod('ReasonCategoryService')
  async getLanguage() {
    return {
      data: reasonLanguages,
    }
  }
}
