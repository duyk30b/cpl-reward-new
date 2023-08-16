import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SafeUser } from './entities/safe-user.entity'

@Injectable()
export class SafeUserService {
  constructor(
    @InjectRepository(SafeUser, 'bce')
    private safeUserRepository: Repository<SafeUser>,
  ) {}

  async getByUserId(userId: string) {
    return await this.safeUserRepository.findOne({
      where: {
        userId,
      },
    })
  }
}
