import ApiService from '@/core/services/ApiService'
import {
  AdminActionLogPayloadModel,
  IAdminActionLogParams,
} from '@/models/admin-permission/AdminActionLog'
import { plainToClass } from 'class-transformer'

export class AdminActionLogService {
  public static async getListActionLog(
    params: IAdminActionLogParams,
  ): Promise<any> {
    const transformedParams = plainToClass(AdminActionLogPayloadModel, params)
    return await ApiService.get(`/log`, { params: transformedParams })
  }
}
