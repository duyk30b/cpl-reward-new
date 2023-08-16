import { User } from '@lib/user/entities/user.entity'
import { toSnakeCase } from '@lib/util'
import { Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Command } from 'nest-commander'
import { Repository } from 'typeorm'

@Command({ name: 'fix:duplicate-social-id' })
export class FixDuplicateSocialIdService {
  private readonly logger = new Logger(FixDuplicateSocialIdService.name)
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async run(passedParam: string[]): Promise<void> {
    const field = passedParam?.[0] || 'fbId'
    const snakeCaseField = toSnakeCase(field)
    const duplicates = await this.userRepository.query(
      `SELECT ${snakeCaseField}, COUNT(id) as count FROM user WHERE ${snakeCaseField} IS NOT NULL GROUP BY ${snakeCaseField} HAVING count > 1`,
    )
    for (const duplicate of duplicates) {
      const value = duplicate[snakeCaseField]
      this.logger.log(value)
      const users = await this.userRepository.find({
        where: {
          [field]: value,
        },
        order: {
          id: 'ASC',
        },
      })
      for (let i = 1; i < users.length; i++) {
        const user = users[i]
        user[field] += `_duplicate_delete_${user.id}`
        await this.userRepository.save(user)
        this.logger.log(`Processed user ${user.id}`)
      }
    }
    this.logger.log('Done')
  }
}
