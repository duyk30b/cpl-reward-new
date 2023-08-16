import { Mission } from './mission.model'
import ApiService from '@/core/services/ApiService'

export class MissionService {
  static async getMany(campaignId: number): Promise<Mission[]> {
    const { data } = await ApiService.get('/mission', {
      params: { campaign_id: campaignId },
    })

    return Mission.fromPlains(data.missions)
  }
}
