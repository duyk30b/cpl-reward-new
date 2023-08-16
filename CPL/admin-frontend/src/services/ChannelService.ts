import ApiService from '@/core/services/ApiService'

export class ChannelService {
  public static async getChannelList(params) {
    return await ApiService.get('/channel', { params: params })
  }

  public static async createChannel(params) {
    return await ApiService.post('/channel', params)
  }

  public static async updateChannel(id, params) {
    return await ApiService.patch(`/channel/${id}`, params)
  }

  public static async deleteChannel(id) {
    return await ApiService.delete(`/channel/${id}`)
  }
}
