import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToClass } from 'class-transformer'
import { Not, Repository } from 'typeorm'
import { UserInfoDto } from '@lib/user/dto/user-info.dto'
import { UserInfo } from '../entities/user-info.entity'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class UserInfoService {
  private lastNameFirstCountries
  constructor(
    @InjectRepository(UserInfo)
    private readonly userInfoRepository: Repository<UserInfo>,
    private readonly configService: ConfigService,
  ) {
    this.lastNameFirstCountries = [
      this.configService.get<number>('special_countries.japan'),
    ]
  }

  async getInfoByUserId(userId: string) {
    return await this.userInfoRepository.findOne({ where: { userId: userId } })
  }

  async saveUserInfo(userInfoDto: UserInfoDto) {
    const info = plainToClass(UserInfo, userInfoDto, {
      exposeUnsetFields: false,
    })
    info.fullName = (this.lastNameFirstCountries || []).find(
      (e) => info.nationalityId == e,
    )
      ? `${info.lastName} ${info.firstName}`
      : `${info.firstName} ${info.lastName}`
    return await this.userInfoRepository.save(info)
  }

  async checkDuplicateInfo(
    userInfoDto: Partial<UserInfoDto>,
    exceptUserId: string,
  ) {
    const { firstName, lastName, birthday, gender } = userInfoDto
    const existed = await this.userInfoRepository.findOne({
      firstName,
      lastName,
      birthday,
      gender,
      userId: Not(exceptUserId),
    })
    return !!existed
  }
}
