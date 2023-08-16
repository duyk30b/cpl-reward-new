import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { plainToInstance } from 'class-transformer'
import { lastValueFrom, map } from 'rxjs'
import { Constants } from '../constants'
import { GrpcSubPairCategoryResponse } from '../dtos/pair-category-setting/grpc-sub-category.dto'
import {
  CreateSubCategoryRequestDto,
  DeleteSubCategoryDto,
  GetSubCategoryByParentId,
  UpdateOrderSubCategoryRequestDto,
  UpdateSubCategoryRequestDto,
} from '../dtos/pair-category-setting/sub-category-input.dto'
import {
  DeleteSubPairCategoryResponse,
  SubCategoryResponseDto,
  UpdateOrderSubCategoryResponse,
} from '../dtos/pair-category-setting/sub-category.dto'
import { IGrpcSubPairCategorySetting } from '../interfaces'

@Injectable()
export class SubCategorySettingService {
  private grpcSubCategorySetting: IGrpcSubPairCategorySetting
  constructor(
    @Inject(Constants.GRPC_EXCHANGE_SETTING_TOKEN)
    private readonly clientGrpc: ClientGrpc,
  ) {}

  public onModuleInit() {
    this.grpcSubCategorySetting = this.clientGrpc.getService(
      Constants.GRPC_SUB_CATEGORY_SERVICE,
    )
  }

  public async getSubPairCategorySetting(
    query: GetSubCategoryByParentId,
  ): Promise<GrpcSubPairCategoryResponse> {
    return lastValueFrom(
      this.grpcSubCategorySetting.getSubPairCategorySetting(query).pipe(
        map((result) =>
          plainToInstance(GrpcSubPairCategoryResponse, result, {
            exposeDefaultValues: true,
          }),
        ),
      ),
    )
  }

  public async createSubPairCategorySetting(
    payload: CreateSubCategoryRequestDto,
  ): Promise<SubCategoryResponseDto> {
    return lastValueFrom(
      this.grpcSubCategorySetting.insertSubPairCategorySetting(payload).pipe(
        map((result) =>
          plainToInstance(SubCategoryResponseDto, result, {
            exposeDefaultValues: true,
          }),
        ),
      ),
    )
  }

  public async updateSubPairCategorySetting(
    payload: UpdateSubCategoryRequestDto,
  ): Promise<SubCategoryResponseDto> {
    return lastValueFrom(
      this.grpcSubCategorySetting.updateSubPairCategorySetting(payload).pipe(
        map((result) =>
          plainToInstance(SubCategoryResponseDto, result, {
            exposeDefaultValues: true,
          }),
        ),
      ),
    )
  }

  public async updateOrderSubPairCategorySetting(
    payload: UpdateOrderSubCategoryRequestDto,
  ): Promise<UpdateOrderSubCategoryResponse> {
    return lastValueFrom(
      this.grpcSubCategorySetting.updateOrderSubCategory(payload).pipe(
        map((result) =>
          plainToInstance(UpdateOrderSubCategoryResponse, result, {
            exposeDefaultValues: true,
          }),
        ),
      ),
    )
  }

  public async deleteSubPairCategorySetting(
    payload: DeleteSubCategoryDto,
  ): Promise<DeleteSubPairCategoryResponse> {
    return lastValueFrom(
      this.grpcSubCategorySetting.deleteSubPairCategorySetting(payload).pipe(
        map((result) =>
          plainToInstance(DeleteSubPairCategoryResponse, result, {
            exposeDefaultValues: true,
          }),
        ),
      ),
    )
  }
}
