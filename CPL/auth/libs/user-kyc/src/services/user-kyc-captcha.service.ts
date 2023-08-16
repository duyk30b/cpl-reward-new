import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserKycCaptcha } from '@lib/user-kyc/entities/user-kyc-captcha.entity'

@Injectable()
export class UserKycCaptchaService {
  constructor(
    @InjectRepository(UserKycCaptcha)
    private readonly userKycCaptchaRepository: Repository<UserKycCaptcha>,
  ) {}

  async getCaptchaByUserId(userId: string) {
    return this.userKycCaptchaRepository.findOne({
      userId,
    })
  }

  async insertCaptcha(userId: string, captcha: string) {
    const userKycCaptcha = new UserKycCaptcha()
    userKycCaptcha.userId = userId
    userKycCaptcha.captcha = captcha
    await this.userKycCaptchaRepository.save(userKycCaptcha)
    return
  }
}
