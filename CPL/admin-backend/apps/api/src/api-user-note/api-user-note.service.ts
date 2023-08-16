import { AdminService } from '@lib/admin'
import { UserNoteService } from '@lib/user-note'
import { Injectable } from '@nestjs/common'
import { CreateUserNoteDto } from './api-user-note.dto'

@Injectable()
export class ApiUserNoteService {
  constructor(
    private readonly userNoteService: UserNoteService,
    private readonly adminService: AdminService,
  ) {}

  async findByUserId(userId: string) {
    const notes = await this.userNoteService.findByUserId(userId)
    const adminIds = notes.map((note) => note.adminId)
    const admins = await this.adminService.getAdminByIds(adminIds)
    const adminMap = admins.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cur,
      }),
      {},
    )
    notes.forEach((note) => {
      note.admin = adminMap[note.adminId]
    })
    return notes
  }

  async create(adminId: string, userId: string, createDo: CreateUserNoteDto) {
    const note = await this.userNoteService.create({
      ...createDo,
      adminId,
      userId,
    })
    note.admin = await this.adminService.getAdminById(adminId)
    return { success: true, note }
  }
}
