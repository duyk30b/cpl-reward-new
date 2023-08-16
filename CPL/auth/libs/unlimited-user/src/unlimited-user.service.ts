import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UnlimitedUser } from './entities/unlimited-user.entity'

@Injectable()
export class UnlimitedUserService {
  constructor(
    @InjectRepository(UnlimitedUser, 'bce')
    private unlimitedUserRepository: Repository<UnlimitedUser>,
  ) {}

  async getByUserId(userId: string) {
    return await this.unlimitedUserRepository.findOne({
      where: {
        userId,
      },
    })
  }
}
