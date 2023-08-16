import ApiService from '@/core/services/ApiService'
import { HttpStatus } from '@/core/variables/common.enum'
import { UserNote } from '@/models/user/UserNote'
import { plainToInstance } from 'class-transformer'

export class UserNoteService {
  public static async findByUserId(userId: string): Promise<UserNote[]> {
    const response = await ApiService.get(`/user-note/${userId}`)
    if (response.status != HttpStatus.OK) {
      return []
    }
    const result = (response.data || []).map((e) =>
      plainToInstance(UserNote, e),
    )
    return result
  }

  public static async create(userId: string, note: string) {
    const res = await ApiService.post(`/user-note/${userId}`, { note })
    return res.data
  }
}
