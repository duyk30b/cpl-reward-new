import ApiService from '@/core/services/ApiService'
import { HttpStatus } from '@/core/variables/common.enum'
import { RejectionReasonCategory } from '@/models/common/RejectionReason'
import { plainToInstance } from 'class-transformer'

export class RejectionReasonService {
  public static async findByType(
    type: string,
  ): Promise<RejectionReasonCategory[]> {
    const response = await ApiService.get(`/rejection-reason`)
    if (response.status != HttpStatus.OK) {
      return []
    }
    return (response.data || [])
      .filter((category) => category.reason_type == type)
      .map((category) => plainToInstance(RejectionReasonCategory, category))
  }
}
