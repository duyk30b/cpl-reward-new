import ApiService from '@/core/services/ApiService'
import {
  ICreateReasonCategory,
  IReasonCategory,
  IReasonCategoryFilter,
} from '@/interfaces/reason-category.interface'
import {
  ICreateReason,
  IReason,
  IReasonFilter,
} from '@/interfaces/reason.interface'
import { HttpStatus } from '@/core/variables/common.enum'
import { plainToInstance } from 'class-transformer'

export class ReasonService {
  /**
   * Create reason category
   * @param data
   */
  public static async createReasonCategory(data: ICreateReasonCategory) {
    return await ApiService.post(`/reason-category`, data)
  }

  /**
   * Update reason category
   * @param data
   */
  public static async updateReasonCategory(data: IReasonCategory) {
    return await ApiService.patch(`/reason-category/${data.id}`, data)
  }

  /**
   * Delete reason category
   * @param id
   */
  public static async deleteReasonCategory(id: string) {
    return await ApiService.delete(`/reason-category/${id}`)
  }

  /**
   * Get reason category list
   * @param params
   */
  public static async getReasonCategoryList(params: IReasonCategoryFilter) {
    return await ApiService.get(`/reason-category`, { params: params })
  }

  /**
   * Get reason category list with type filter
   * @param type
   */
  public static async getReasonCategoryListByType(
    type: number,
  ): Promise<IReasonCategory[]> {
    const response = await ApiService.get(`/reason-category`, {
      params: {
        type: type,
      },
    })
    if (response.status != HttpStatus.OK) {
      return []
    }
    return (response.data.data || []).map((category) =>
      plainToInstance(IReasonCategory, category),
    )
  }

  /**
   * Create reason
   * @param data
   */
  public static async createReason(data: ICreateReason) {
    return await ApiService.post(`/reason`, data)
  }

  /**
   * Update reason
   * @param data
   */
  public static async updateReason(data: IReason) {
    return await ApiService.patch(`/reason/${data.id}`, data)
  }

  /**
   * Delete reason
   * @param id
   */
  public static async deleteReason(id: string) {
    return await ApiService.delete(`/reason/${id}`)
  }

  /**
   * Get reason list
   * @param params
   */
  public static async getReasonList(params: IReasonFilter) {
    return await ApiService.get(`/reason`, { params: params })
  }

  /**
   * Get language for reason function
   */
  public static async getLanguage() {
    const response = await ApiService.get(`/reason-category/language`)
    return response.data || []
  }
}
