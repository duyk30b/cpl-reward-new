import { Injectable } from '@nestjs/common'
import { InjectConnection, InjectRepository } from '@nestjs/typeorm'
import { Connection, Repository } from 'typeorm'
import { UserSetting } from '../entities/user-setting.entity'
import { TutorialStatus, TutorialType } from '../enum/user.enum'

@Injectable()
export class AuthUserSettingService {
  constructor(
    @InjectRepository(UserSetting)
    private readonly userSettingRepository: Repository<UserSetting>,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async getUserSetting(userId) {
    let setting = await this.userSettingRepository.findOne({ id: userId })
    if (!setting) {
      setting = await this.createDefaultSettingForUser(userId)
    }
    return setting
  }

  async createDefaultSettingForUser(userId: string) {
    const setting = new UserSetting()
    setting.id = userId
    setting.exchangeTutorialStatus = TutorialStatus.ON
    setting.boTutorialStatus = TutorialStatus.ON
    await this.connection
      .createQueryBuilder()
      .insert()
      .into(UserSetting)
      .values(setting)
      .orUpdate(['exchange_tutorial_status', 'bo_tutorial_status'], ['id'])
      .execute()
    return setting
  }

  async updateTutorialStatus(
    userId: string,
    type: TutorialType,
    status: TutorialStatus,
  ) {
    const setting = await this.getUserSetting(userId)
    if (type == TutorialType.EXCHANGE) {
      setting.exchangeTutorialStatus = status
    } else {
      setting.boTutorialStatus = status
    }
    await this.userSettingRepository.save(setting)
  }
}
