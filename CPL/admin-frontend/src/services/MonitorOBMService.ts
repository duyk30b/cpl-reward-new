import CONFIG from '@/config'
import { clearParams } from '@/core/helpers/util'
import ApiService from '@/core/services/ApiService'
import { HttpStatus } from '@/core/variables/common.enum'
import { BodyGeneric } from '@/models/common/MasterData'
import {
  CounterOrderItem,
  CounterOrderResponse,
  OBMCounterOrderParams,
  PairPagination,
  RecoveryOrderItem,
} from '@/models/monitor-obm/Counter'
import { plainToInstance } from 'class-transformer'

export class MonitorOBMService {
  public static async getCounterOrder(
    params: OBMCounterOrderParams,
  ): Promise<BodyGeneric<CounterOrderResponse>> {
    const payload = clearParams(params)
    const res = await ApiService.get(`/counter`, {
      params: plainToInstance(OBMCounterOrderParams, payload, {
        exposeUnsetFields: false,
      }),
      baseURL: CONFIG.OBM_MONITOR,
      transformRequest: [
        (data, headers) => {
          delete headers.common.Authorization
          return data
        },
      ],
    })
    const pagination: PairPagination = {
      page: res.data.page ?? 0,
      size: res.data.size ?? 10,
      total: res.data.total ?? 0,
    }
    return {
      data: {
        data: res.data.data ?? [],
        pagination,
      },
      status: 200,
    }
  }

  public static async getCounterOrderById(
    id: string,
  ): Promise<CounterOrderItem> {
    const counterOrder = await ApiService.get(`/counter/${id}`, {
      baseURL: CONFIG.OBM_MONITOR,
      transformRequest: [
        (data, headers) => {
          delete headers.common.Authorization
          return data
        },
      ],
    })
    if (counterOrder.status != HttpStatus.OK) return {} as CounterOrderItem
    return plainToInstance(CounterOrderItem, counterOrder.data)
  }

  public static async getRecoveryOrderById(
    id: string,
  ): Promise<RecoveryOrderItem> {
    const recoveryOrder = await ApiService.get(`/recovery/${id}`, {
      baseURL: CONFIG.OBM_MONITOR,
      transformRequest: [
        (data, headers) => {
          delete headers.common.Authorization
          return data
        },
      ],
    })
    if (recoveryOrder.status != HttpStatus.OK) return {} as RecoveryOrderItem
    return plainToInstance(RecoveryOrderItem, recoveryOrder.data)
  }
}
