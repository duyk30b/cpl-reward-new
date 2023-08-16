import { UserEmail } from '@lib/user-email/entities/user-email.entity'
import { EUserEmailType } from '@lib/user-email/user-email.enum'
import { User } from '@lib/user/entities/user.entity'
import { formatEmail } from '@lib/util'
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Command } from 'nest-commander'
import { LessThan, Repository } from 'typeorm'

@Command({ name: 'map:user-email' })
export class MapUserEmailService {
  private readonly logger = new Logger(MapUserEmailService.name)
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserEmail)
    private readonly userEmailRepository: Repository<UserEmail>,
    private readonly configService: ConfigService,
  ) {}

  async run(): Promise<void> {
    const userIdToStart = await this.getUserIdToStartMigrate()
    const count = await this.userRepository.count({
      id: LessThan(userIdToStart),
    })
    const PER_PAGE = 5000
    const numberOfPage = Math.round(count / PER_PAGE) + 1
    this.logger.log(`Start from user: ${userIdToStart}`)
    for (let i = 0; i < numberOfPage; i++) {
      await this.mapUserEmail(userIdToStart, PER_PAGE, i)
    }
    this.logger.log('Done')
  }

  async getUserIdToStartMigrate() {
    const query = this.userEmailRepository.createQueryBuilder('user_email')
    query.select('MIN(user_email.user_id)', 'max')
    const result = await query.getRawOne()
    return result.max || 9999999999999
  }

  async mapUserEmail(userIdToStart: number, perPage: number, page: number) {
    const ignoreEmailDomains = this.configService.get('ignore_email_domains')
    const users = await this.userRepository
      .createQueryBuilder()
      .where({
        id: LessThan(userIdToStart),
      })
      .orderBy('id', 'DESC')
      .limit(perPage)
      .offset(page * perPage)
      .getMany()
    for (let i = 0; i < users.length; i++) {
      const user = users[i]
      const fields = ['email', 'fbId', 'ggId', 'appleId']
      for (const field of fields) {
        const email = formatEmail(user[field], ignoreEmailDomains)
        if (email) {
          const map = new UserEmail()
          map.userId = user.id
          map.email = email
          map.type = field as EUserEmailType
          await this.userEmailRepository.save(map)
        }
      }
      this.logger.log(`Processed user: ${user.id}`)
    }
  }
}
