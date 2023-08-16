import ApiService from '@/core/services/ApiService'
import { Campaign } from './campaign.model'
import type { PaginationCampaignRequest, PaginationCampaignResponse } from './campaign.variable'

export class CampaignService {
  static async pagination(params: PaginationCampaignRequest) {
    const response = await ApiService.get('/campaign', { params })
    const data = response.data as PaginationCampaignResponse
    return {
      data: Campaign.fromPlains(data.data),
      links: data.links,
      pagination: data.pagination,
      prices: data.prices,
    }
  }

  static async getOne(id: number) {
    const { data } = await ApiService.get(`/campaign/${id}`)
    return Campaign.fromPlain(data)
  }

  static async createOne(campaign: Campaign) {
    const campaignDto = Campaign.toPlain(campaign)
    return await ApiService.post('/campaign', campaignDto)
  }

  static async updateOne(id: number, campaign: Campaign) {
    const campaignDto = Campaign.toPlain(campaign)
    return await ApiService.patch(`campaign/${id}`, campaignDto)
  }
}
