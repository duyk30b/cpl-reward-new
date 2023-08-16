import { UserService } from '@lib/user'
import { User } from '@lib/user/entities/user.entity'
import { escapeLikeChars } from '@lib/util'
import { Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Command } from 'nest-commander'
import { Repository } from 'typeorm'

@Command({ name: 'delete:tester-users' })
export class DeleteTesterUserService {
  private readonly logger = new Logger(DeleteTesterUserService.name)
  constructor(
    private readonly userService: UserService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async run(passedParam: string[]): Promise<void> {
    const emailPrefix = passedParam?.[0]
    if (!emailPrefix) return
    const users = await this.userRepository
      .createQueryBuilder()
      .where('email LIKE :email', { email: `${escapeLikeChars(emailPrefix)}%` })
      .getMany()
    console.log(users)
    for (const user of users) {
      await this.userService.deleteUser(user.id)
      this.logger.log(`Deleted user ${user.id}`)
    }
    this.logger.log('Done')
  }
}
