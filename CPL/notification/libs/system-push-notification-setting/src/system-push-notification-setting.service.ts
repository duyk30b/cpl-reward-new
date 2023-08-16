import { DEFAULT_LANG, isSupportedLang } from '@libs/common'
import { escapeLikeChars, formatPaginate, SortType } from '@libs/util'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  IPaginationOptions,
  paginate,
  PaginationTypeEnum,
} from 'nestjs-typeorm-paginate'
import { Brackets, Repository } from 'typeorm'
import { SystemPushNotificationSetting } from './system-push-notification-setting.entity'
import {
  ISystemPushNotificationSettingFilter,
  IToggleActiveDto,
  IUpdateSystemPushNotificationSettingDto,
} from './system-push-notification-setting.interface'

@Injectable()
export class SystemPushNotificationSettingService {
  constructor(
    @InjectRepository(SystemPushNotificationSetting)
    private readonly systemPushNotiSettingRepository: Repository<SystemPushNotificationSetting>,
  ) {}

  async findByType(type: string) {
    return await this.systemPushNotiSettingRepository.find({
      where: {
        type,
      },
    })
  }

  async findById(id: string) {
    return await this.systemPushNotiSettingRepository.findOne({ id })
  }

  async updateSetting(
    updateSettingDto: IUpdateSystemPushNotificationSettingDto,
  ) {
    const { id, title, content, isActive } = updateSettingDto
    const setting = await this.findById(id)
    if (setting) {
      setting.title = title
      setting.content = content
      setting.isActive = isActive
      await this.systemPushNotiSettingRepository.save(setting)
    }
  }

  async toggleActive(toggleActiveDto: IToggleActiveDto) {
    const { id, isActive } = toggleActiveDto
    await this.systemPushNotiSettingRepository.update(id, { isActive })
  }

  async getListSetting(settingFilter: ISystemPushNotificationSettingFilter) {
    const query = this.buildListSettingQuery(settingFilter)

    const options: IPaginationOptions = {
      page: settingFilter.page || 1,
      limit: settingFilter.limit || 25,
      paginationType: PaginationTypeEnum.LIMIT_AND_OFFSET,
    }

    const result = await formatPaginate(paginate(query, options))
    return result
  }

  private buildListSettingQuery(
    settingFilter: ISystemPushNotificationSettingFilter,
  ) {
    const { searchField, searchText, type, isActive, sort, sortType } =
      settingFilter

    const lang =
      settingFilter.lang && isSupportedLang(settingFilter.lang)
        ? settingFilter.lang
        : DEFAULT_LANG

    const SORT_FIELD_MAP = {
      type: 'type',
      is_active: 'is_active',
      title: `JSON_EXTRACT(title, '$.${lang}')`,
      content: `JSON_EXTRACT(content, '$.${lang}')`,
    }

    const SEARCH_FIELD_MAP = {
      title: `JSON_EXTRACT(title, '$.${lang}')`,
      content: `JSON_EXTRACT(content, '$.${lang}')`,
    }

    const query =
      this.systemPushNotiSettingRepository.createQueryBuilder('setting')

    if (searchText) {
      query.andWhere(
        new Brackets((qb) => {
          if (searchField && SEARCH_FIELD_MAP[searchField]) {
            qb.where(`${SEARCH_FIELD_MAP[searchField]} LIKE :keyword`)
          } else {
            Object.keys(SEARCH_FIELD_MAP).forEach((field) => {
              qb.orWhere(`${SEARCH_FIELD_MAP[field]} LIKE :keyword`)
            })
          }
        }),
        {
          keyword: `%${escapeLikeChars(searchText)}%`,
        },
      )
    }

    if (isActive != null) {
      query.andWhere('is_active = :isActive', { isActive })
    }

    if (type) {
      query.andWhere('type = :type', { type })
    }

    if (sort && SORT_FIELD_MAP[sort]) {
      query.orderBy(SORT_FIELD_MAP[sort], sortType || SortType.ASC)
    } else {
      query.orderBy('type', SortType.DESC)
    }
    query.addOrderBy('id', SortType.ASC)

    return query
  }
}
