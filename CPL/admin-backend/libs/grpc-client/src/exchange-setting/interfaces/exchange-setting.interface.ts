import { BasePaginationQueryDto } from '@app/common/base-pagination.dto'
import { Observable } from 'rxjs'
import {
  CreateCoinSettingDto,
  DeleteCoinSetting,
  GetCoinSettingRequest,
  GetListCoinNameRequest,
  GrpcCoinSetting,
  GrpcCoinSettingDto,
  GrpcCoinSettingPaginationResponse,
  GrpcGetListCoinNameResponse,
} from '../dtos/coin'
import {
  CreatePairCategoryItemDto,
  DeletePairCategoryResponseDto,
  PairCategorySettingDto,
  UpdateOrderCategoryRequestDto,
  UpdateOrderCategoryResponse,
  UpdatePairCategoryItemDto,
} from '../dtos/pair-category-setting'
import {
  DeletePairCategoryRequest,
  GetPairCategoryRequest,
  GrpcPairCategorySetting,
  GrpcPairCategorySettingPaginationResponse,
  PairCategorySettingRequest,
  PairCategorySettingResponse,
} from '../dtos/pair-category-setting/grpc-pair-category.dto'
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
import {
  DeletePairSettingParamDto,
  GetListPairNameRequestDto,
  GetPairSettingFilterRequest,
  GrpcListPairNameResponse,
  GrpcPairSettingDto,
  GrpcPairSettingPaginationResponse,
  GrpcSinglePairSettingResponse,
  PairSettingItemDto,
  PairSettingItemWithUserDto,
  PairSettingParamsDto,
} from '../dtos/pair-setting'

class GetAllCoinSettingsRequest {}

export interface IGrpcCoinSetting {
  getListCoinName: (
    request: GetListCoinNameRequest,
  ) => Observable<GrpcGetListCoinNameResponse>
  getAllCoinSettings: (
    request: GetAllCoinSettingsRequest,
  ) => Observable<GrpcCoinSetting>
  getCoinSetting: (
    request: GetCoinSettingRequest,
  ) => Observable<GrpcCoinSettingDto>
  getCoinSettingByPagination: (
    request: BasePaginationQueryDto,
  ) => Observable<GrpcCoinSettingPaginationResponse>
  setCoinSetting: (
    request: CreateCoinSettingDto,
  ) => Observable<GrpcCoinSettingDto>
  deleteCoinSetting: (
    request: DeleteCoinSetting,
  ) => Observable<DeleteCoinSetting>
}

export interface IGrpcPairSetting {
  getPairSetting: (
    request: GetPairSettingFilterRequest,
  ) => Observable<GrpcPairSettingDto>
  getListPairName: (
    request: GetListPairNameRequestDto,
  ) => Observable<GrpcListPairNameResponse>
  getPairSettingByPagination: (
    request: BasePaginationQueryDto,
  ) => Observable<GrpcPairSettingPaginationResponse>
  setPairSetting: (
    pairItem: PairSettingItemWithUserDto,
  ) => Observable<PairSettingItemDto>
  getSinglePairSetting: (
    request: PairSettingParamsDto,
  ) => Observable<GrpcSinglePairSettingResponse>
  deletePairSetting: (
    request: DeletePairSettingParamDto,
  ) => Observable<PairSettingParamsDto>
}

export interface IGrpcPairCategorySetting {
  getPairCategorySetting: (
    request: PairCategorySettingRequest,
  ) => Observable<GrpcPairCategorySetting>
  getPairCategorySettingByPagination: (
    request: BasePaginationQueryDto,
  ) => Observable<GrpcPairCategorySettingPaginationResponse>
  getPairCategorySettingById: (
    request: GetPairCategoryRequest,
  ) => Observable<PairCategorySettingDto>
  insertPairCategorySetting: (
    request: CreatePairCategoryItemDto,
  ) => Observable<PairCategorySettingDto>
  updatePairCategorySetting: (
    request: UpdatePairCategoryItemDto,
  ) => Observable<DeletePairCategoryResponseDto>
  updateOrderCategory: (
    request: UpdateOrderCategoryRequestDto,
  ) => Observable<UpdateOrderCategoryResponse>
  deletePairCategorySetting: (
    request: DeletePairCategoryRequest,
  ) => Observable<PairCategorySettingResponse>
  getSubPairCategorySetting: (
    request: GetSubCategoryByParentId,
  ) => Observable<GrpcSubPairCategoryResponse>
}
export interface IGrpcSubPairCategorySetting {
  getSubPairCategorySetting: (
    request: GetSubCategoryByParentId,
  ) => Observable<GrpcSubPairCategoryResponse>
  insertSubPairCategorySetting: (
    request: CreateSubCategoryRequestDto,
  ) => Observable<SubCategoryResponseDto>
  updateSubPairCategorySetting: (
    request: UpdateSubCategoryRequestDto,
  ) => Observable<SubCategoryResponseDto>
  updateOrderSubCategory: (
    request: UpdateOrderSubCategoryRequestDto,
  ) => Observable<UpdateOrderSubCategoryResponse>
  deleteSubPairCategorySetting: (
    request: DeleteSubCategoryDto,
  ) => Observable<DeleteSubPairCategoryResponse>
}
