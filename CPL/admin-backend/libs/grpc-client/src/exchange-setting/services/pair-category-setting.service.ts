import { BasePaginationQueryDto } from '@app/common/base-pagination.dto'
import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { plainToInstance } from 'class-transformer'
import { lastValueFrom, map } from 'rxjs'
import { Constants } from '../constants'
import {
  DeletePairCategoryResponseDto,
  GrpcPairCategorySettingPaginationResponse,
  PairCategorySettingDto,
  UpdateOrderCategoryResponse,
  UpdatePairCategoryResponseDto,
} from '../dtos/pair-category-setting'
import {
  CreatePairCategoryItemDto,
  UpdateOrderCategoryRequestDto,
  UpdatePairCategoryItemDto,
} from '../dtos/pair-category-setting/pair-category-input.dto'
import { IGrpcPairCategorySetting } from '../interfaces'

@Injectable()
export class PairCategorySettingService implements OnModuleInit {
  private grpcPairCategorySetting: IGrpcPairCategorySetting
  constructor(
    @Inject(Constants.GRPC_EXCHANGE_SETTING_TOKEN)
    private readonly clientGrpc: ClientGrpc,
  ) {}

  public onModuleInit() {
    this.grpcPairCategorySetting = this.clientGrpc.getService(
      Constants.GRPC_PAIR_CATEGORY_SETTING_SERVICE,
    )
  }

  public async getPairCategorySetting(
    query: BasePaginationQueryDto,
  ): Promise<GrpcPairCategorySettingPaginationResponse> {
    return lastValueFrom(
      this.grpcPairCategorySetting
        .getPairCategorySettingByPagination(query)
        .pipe(
          map((result) =>
            plainToInstance(GrpcPairCategorySettingPaginationResponse, result, {
              exposeDefaultValues: true,
            }),
          ),
        ),
    )
  }

  public async getPairCategorySettingById(
    id: string,
  ): Promise<PairCategorySettingDto> {
    return lastValueFrom(
      this.grpcPairCategorySetting.getPairCategorySettingById({ id: id }).pipe(
        map((result) =>
          plainToInstance(PairCategorySettingDto, result, {
            exposeDefaultValues: true,
          }),
        ),
      ),
    )
  }

  public async createPairCategoryItem(
    item: CreatePairCategoryItemDto,
  ): Promise<PairCategorySettingDto> {
    return lastValueFrom(
      this.grpcPairCategorySetting.insertPairCategorySetting(item).pipe(
        map((result) =>
          plainToInstance(PairCategorySettingDto, result, {
            exposeDefaultValues: true,
          }),
        ),
      ),
    )
  }

  public async updatePairCategoryItem(
    item: UpdatePairCategoryItemDto,
  ): Promise<UpdatePairCategoryResponseDto> {
    return lastValueFrom(
      this.grpcPairCategorySetting.updatePairCategorySetting(item),
    )
  }

  public async updateOrderPairCategoryItem(
    item: UpdateOrderCategoryRequestDto,
  ): Promise<UpdateOrderCategoryResponse> {
    return lastValueFrom(this.grpcPairCategorySetting.updateOrderCategory(item))
  }

  public async deletePairCategoryItem(
    id: string,
  ): Promise<DeletePairCategoryResponseDto> {
    return lastValueFrom(
      this.grpcPairCategorySetting.deletePairCategorySetting({ id: id }),
    )
  }
}
