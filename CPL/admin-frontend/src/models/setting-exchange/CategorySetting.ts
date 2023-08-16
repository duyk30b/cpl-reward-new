import { PAIR_STATUS } from '@/core/variables/common.enum'
import { Exclude, Expose } from 'class-transformer'
import { PairPagination } from './TradingPair'

export class CategoryPairItem {
  @Expose()
  coin: string

  @Expose()
  currency: string

  @Expose()
  status: PAIR_STATUS
}

export class SubCategoryItem {
  @Expose()
  parent_id: string

  @Expose()
  status: PAIR_STATUS = PAIR_STATUS.ACTIVE

  @Expose()
  language_key: string

  @Expose()
  pairs: CategoryPairItem[]

  @Expose()
  index: number
}

export class SubCategorySetting extends SubCategoryItem {
  @Expose()
  id: string
}
export class UpdateSubCategory extends SubCategorySetting {}

export class CreateSubCategory extends SubCategoryItem {}

export class DeleteSubCategory {
  @Expose()
  id: string
}

@Exclude()
export class BigCategory {
  @Expose()
  id: string

  @Expose()
  language_key: string

  @Expose()
  status: PAIR_STATUS

  @Expose()
  sub_category: SubCategorySetting[] = []

  @Expose()
  index: number
}

@Exclude()
export class CreateBigCategory {
  @Expose()
  language_key: string

  @Expose()
  status: PAIR_STATUS

  @Expose()
  index: number
}

@Exclude()
export class UpdateBigCategory extends CreateBigCategory {
  @Expose()
  id: string
}

export class CategoryList {
  data: BigCategory[]
  pagination?: PairPagination
}

export class OrderCategoryRequest {
  @Expose()
  id: string

  @Expose()
  index: number
}

export class UpdateOrderCategoryRequestDto {
  @Expose()
  data: OrderCategoryRequest[]
}

export class UpdateOrderCategoryResponse {
  @Expose()
  status: boolean
}
export class UpdateOrderSubCategoryRequestDto extends UpdateOrderCategoryRequestDto {}

export class UpdateOrderSubCategoryResponse extends UpdateOrderCategoryResponse {}
