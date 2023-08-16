import ApiService from '@/core/services/ApiService'

export class MissionService {
  public static async createMission(params) {
    return await ApiService.post('/mission', params)
  }

  public static async updateMission(params) {
    return await ApiService.put(`/mission/${params.id}`, params)
  }

  public static async getMissingRewards(params) {
    return await ApiService.get(`/mission/missing-rewards`, { params })
  }
}
