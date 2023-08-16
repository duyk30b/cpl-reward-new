import { User } from '@lib/user/entities/user.entity'
import { EmailExistError, formatEmail } from '@lib/util'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Not, Repository } from 'typeorm'
import { UserEmail } from '../entities/user-email.entity'
import { EUserEmailType } from '../user-email.enum'

@Injectable()
export class UserEmailService {
  private readonly ignoreEmailDomains: string[]
  constructor(
    @InjectRepository(UserEmail)
    private readonly userEmailRepository: Repository<UserEmail>,
    private readonly configService: ConfigService,
  ) {
    this.ignoreEmailDomains = this.configService.get('ignore_email_domains')
  }

  async mapUserEmail(user: User) {
    const fields = ['email', 'fbId', 'ggId', 'appleId']
    for (const field of fields) {
      await this.saveUserEmail(user.id, user[field], field as EUserEmailType)
    }
  }

  async saveUserEmail(
    userId: string,
    email: string,
    type = EUserEmailType.EMAIL,
  ) {
    email = formatEmail(email, this.ignoreEmailDomains)
    if (!email) return
    let map = await this.userEmailRepository.findOne({
      userId,
      type,
    })
    if (!map) {
      map = new UserEmail()
      map.userId = userId
      map.type = type
    }
    map.email = email
    return await this.userEmailRepository.save(map)
  }

  async checkEmailExist(email: string, exceptUserId: string = null) {
    email = formatEmail(email, this.ignoreEmailDomains)
    if (!email) return { exist: false }
    let query = this.userEmailRepository
      .createQueryBuilder('user_email')
      .where({
        email: email,
      })
    if (exceptUserId) {
      query = query.andWhere({ userId: Not(exceptUserId) })
    }

    const existed = await query.getOne()
    let response = null

    if (!existed) {
      return { exist: false }
    }
    if (existed.type == EUserEmailType.FB) {
      response = EmailExistError.EXIST_IN_FB
    } else if (existed.type == EUserEmailType.GG) {
      response = EmailExistError.EXIST_IN_GG
    } else if (existed.type == EUserEmailType.APPLE) {
      response = EmailExistError.EXIST_IN_APPLE
    } else {
      response = EmailExistError.EXIST_IN_EMAIL
    }
    return {
      exist: true,
      response,
    }
  }

  async deleteUser(userId: string) {
    await this.userEmailRepository.delete({
      userId,
    })
  }
}
