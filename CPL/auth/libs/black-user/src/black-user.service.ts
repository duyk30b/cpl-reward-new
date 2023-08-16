import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BlackUser } from './entities/black-user.entity'

@Injectable()
export class BlackUserService {
  constructor(
    @InjectRepository(BlackUser, 'bce')
    private blackUserRepository: Repository<BlackUser>,
  ) {}

  async getIgnoredUsers(userId: string) {
    // (deleted_at is null) OR (deleted_at is not null AND is_updating = 1)
    const queryBuilder = this.blackUserRepository
      .createQueryBuilder('black_users')
      .select(['*'])
    queryBuilder.andWhere('black_users.user_id = :userId ', { userId })
    queryBuilder.andWhere(
      '((black_users.deleted_at IS NULL) OR (black_users.deleted_at IS NOT NULL AND black_users.is_updating = 1))',
    )
    return await queryBuilder.getRawOne()
  }
}
