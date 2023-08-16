import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserNote } from './user-note.entity'
import { ICreateUserNoteDto } from './user-note.variable'

@Injectable()
export class UserNoteService {
  constructor(
    @InjectRepository(UserNote)
    private readonly userNoteRepository: Repository<UserNote>,
  ) {}

  async findByUserId(userId: string) {
    return await this.userNoteRepository.find({
      where: { userId },
      order: {
        createdAt: 'DESC',
      },
    })
  }

  async create(createDto: ICreateUserNoteDto) {
    const record = new UserNote()
    record.userId = createDto.userId
    record.adminId = createDto.adminId
    record.note = createDto.note
    return await this.userNoteRepository.save(record)
  }
}
