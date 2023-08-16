import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToClass } from 'class-transformer'
import { In, Repository } from 'typeorm'
import { UserInfoHistory } from '@lib/user/entities/user-info-history.entity'
import { UserInfoHistoryDto } from '../dto/user-info-history.dto'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class UserInfoHistoryService {
  private lastNameFirstCountries
  constructor(
    @InjectRepository(UserInfoHistory)
    private readonly userInfoHistoryRepository: Repository<UserInfoHistory>,
    private readonly configService: ConfigService,
  ) {
    this.lastNameFirstCountries = [
      this.configService.get<number>('special_countries.japan'),
    ]
  }

  async getUserInfoHistoryById(userInfoHistoryId: string) {
    return await this.userInfoHistoryRepository.findOne(userInfoHistoryId)
  }

  async saveUserInfoHistory(userInfoHistoryDto: UserInfoHistoryDto) {
    const history = plainToClass(UserInfoHistory, userInfoHistoryDto, {
      exposeUnsetFields: false,
    })
    history.fullName = (this.lastNameFirstCountries || []).find(
      (e) => history.nationalityId == e,
    )
      ? `${history.lastName} ${history.firstName}`
      : `${history.firstName} ${history.lastName}`
    return await this.userInfoHistoryRepository.save(history)
  }

  async getListUserInfoHistory(ids: string[]) {
    return await this.userInfoHistoryRepository.find({
      where: { id: In(ids) },
    })
  }

  async getInfoHistoriesByUserId(userId: string) {
    return await this.userInfoHistoryRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    })
  }
}
