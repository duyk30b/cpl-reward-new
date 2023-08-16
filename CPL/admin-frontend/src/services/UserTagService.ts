import ApiService from '@/core/services/ApiService'

export interface IAddTagsForUsers {
  user_id: number
  tag_ids: number[]
}
export class UserTagService {
  public static async getTagByIds(ids) {
    return await ApiService.get(`/tag/find-by-ids`, { params: { ids: ids } })
  }
  public static async getListUserTags(params) {
    return await ApiService.get(`/user/marketing`, { params: params })
  }

  public static async getListTags(params) {
    return await ApiService.get(`/tag/search`, { params: params })
  }

  public static async createNewTag(name) {
    return await ApiService.post(`/tag`, { names: [name] })
  }

  public static async createOneTag(name) {
    return await ApiService.post(`/tag/create-one`, { name: name })
  }

  public static async addTagsForUsers(userIds: number[], tagIds: number[]) {
    const userTags = [] as IAddTagsForUsers[]
    for (let i = 0; i < userIds.length; i++) {
      userTags.push({ user_id: userIds[i], tag_ids: tagIds })
    }
    return await ApiService.post(`/user-tag`, { user_tags: userTags })
  }

  public static async deleteTagsByUsers(userIds) {
    return await ApiService.post(`/user-tag/delete-many-by-users`, {
      user_ids: userIds,
    })
  }

  public static async getUserTagExport() {
    return await ApiService.get(`/user/marketing/export`)
  }

  public static async createUserTagExport(params) {
    return await ApiService.post(`/user/marketing/export`, params)
  }
}
