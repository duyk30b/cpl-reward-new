import { RedisService } from '@lib/redis'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Not, Repository } from 'typeorm'
import { AdminScreenEntity } from '../entities/admin-screen.entity'

@Injectable()
export class AdminScreenService {
  constructor(
    @InjectRepository(AdminScreenEntity)
    private readonly userScreenRepository: Repository<AdminScreenEntity>,
    private readonly redisService: RedisService,
  ) {}

  async addScreensToAdmin(userId: string, screenIds: number[]) {
    if (!screenIds) screenIds = []
    await this.userScreenRepository.delete({
      userId,
      screenId: Not(In(screenIds)),
    })
    const existedScreens = await this.userScreenRepository.find({
      userId,
      screenId: In(screenIds),
    })
    const existedScreenIds = existedScreens.map((relation) => relation.screenId)
    const newScreenIds = screenIds.filter(
      (id) => !existedScreenIds.find((existedId) => existedId == id),
    )
    const dataInsert = newScreenIds.map((screenId) => ({
      screenId,
      userId,
    }))
    return await this.userScreenRepository.save(dataInsert)
  }

  async getScreensByUserId(userId: string) {
    const records = await this.userScreenRepository.find({ userId })
    return records.map((record) => record.screenId)
  }
}
