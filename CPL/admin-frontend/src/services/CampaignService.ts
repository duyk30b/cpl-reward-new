import ApiService from '@/core/services/ApiService'

export class CampaignService {
  public static async getMissingRewards(params) {
    return await ApiService.get(`/reward-log/missing`, { params })
  }

  public static async getMissingRewardsCount() {
    return await ApiService.get(`/reward-log/missing-count`)
  }
  public static async resolveMissingReward(id, status) {
    return await ApiService.patch(`/reward-log/${id}/resolve`, {
      status,
    })
  }
}
