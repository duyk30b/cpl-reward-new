import { GrpcMethod } from '@nestjs/microservices'
import { GrpcReasonService } from './grpc-reason-service'
import { Body, Controller } from '@nestjs/common'
import {
  IBaseReasonResponse,
  ICreateReason,
  IReason,
  IReasonFilter,
  IReasonId,
  IReasonList,
} from 'lib/reason/interfaces/reason.interface'
import { GrpcReasonCategoryService } from '../reason-category/grpc-reason-category.service'
@Controller('Reason')
export class GrpcReasonController {
  constructor(
    private readonly reasonService: GrpcReasonService,
    private readonly reasonCategoryService: GrpcReasonCategoryService,
  ) {}

  @GrpcMethod('ReasonService')
  async create(
    @Body() createReason: ICreateReason,
  ): Promise<IBaseReasonResponse> {
    let success = true
    let message = null

    try {
      await this.reasonService.create(createReason)
    } catch (e) {
      success = false
      message = e.message
    }

    return {
      success,
      message,
    }
  }

  @GrpcMethod('ReasonService')
  async findAll(reasonFilter: IReasonFilter): Promise<IReasonList> {
    return await this.reasonService.findAll(reasonFilter)
  }

  @GrpcMethod('ReasonService')
  async findById(reasonId: IReasonId): Promise<IReason> {
    return this.reasonService.findById(reasonId.id)
  }

  @GrpcMethod('ReasonService')
  async update(reason: IReason): Promise<IBaseReasonResponse> {
    let success = true
    let message = null

    try {
      await this.reasonService.update(reason)
    } catch (e) {
      success = false
      message = e.message
    }

    return {
      success,
      message,
    }
  }

  @GrpcMethod('ReasonService')
  async delete(reasonId: IReason): Promise<IBaseReasonResponse> {
    let success = true
    let message = null

    try {
      await this.reasonService.delete(reasonId.id)
    } catch (e) {
      success = false
      message = e.message
    }

    return {
      success,
      message,
    }
  }
}
