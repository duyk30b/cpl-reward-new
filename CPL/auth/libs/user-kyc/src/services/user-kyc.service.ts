import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToClass } from 'class-transformer'
import { Brackets, FindConditions, In, Not, Repository } from 'typeorm'
import { CreateUserKycDto } from '../dto/create-user-kyc.dto'
import { UserKyc } from '../entities/user-kyc.entity'
import {
  KycFilterType,
  KycIdDocumentType,
  KycImageProvider,
  KycRiskScanProvider,
  KycStatus,
  KycType,
} from '../enum/user-kyc.enum'
import { IUserKycFilter } from '../interfaces/user-kyc.interface'
import { UpdateUserKycDto } from '../dto/update-user-kyc.dto'
import { escapeLikeChars } from '@lib/util'
import {
  IPaginationOptions,
  paginateRaw,
  PaginationTypeEnum,
} from 'nestjs-typeorm-paginate'

const PERSONAL_KYC_SEARCH_FIELD_MAP = {
  email: 'user.email',
  phone: 'CONCAT("+", user_info_history.phoneCountry, user_info_history.phone)',
  name: 'user_info_history.fullName',
}

const ENTERPRISE_KYC_SEARCH_FIELD_MAP = {
  login_email: 'user.email',
  applicant_name: 'enterprise_info.applicant_name',
  company_name: 'enterprise_info.company_name',
  contact_number: 'enterprise_info.contact_number',
}

const PERSONAL_KYC_SORT_FIELD_MAP = {
  email: 'user.email',
  full_name: 'user_info_history.fullName',
  created_at: 'user_kyc_history.createdAt',
  last_login: 'user.lastLogin',
  risk_rating: 'user_kyc.riskRating',
}

const ENTERPRISE_KYC_SORT_FIELD_MAP = {
  login_email: 'user.email',
  applicant_name: 'enterprise_info.applicantName',
  company_name: 'enterprise_info.companyName',
  contact_number: 'enterprise_info.contactNumber',
  created_at: 'user_kyc_history.createdAt',
  last_login: 'user.lastLogin',
  risk_rating: 'user_kyc.riskRating',
}

@Injectable()
export class UserKycService {
  constructor(
    @InjectRepository(UserKyc)
    private readonly userKycRepository: Repository<UserKyc>,
  ) {}

  async getKycByUserId(userId: string) {
    return await this.userKycRepository.findOne({ where: { userId: userId } })
  }

  async getKycByIdDocumentNo(idDocumentNo: string) {
    return await this.userKycRepository.findOne({ where: { idDocumentNo } })
  }

  async checkDuplicateIdDocumentNo(
    idDocumentNo: string,
    idDocumentType: number,
    countryId: number,
    exceptUserId?: string,
  ) {
    if (!idDocumentNo) return false
    const condition: FindConditions<UserKyc> = {
      idDocumentNo,
      idDocumentType,
      status: In([
        KycStatus.APPROVED_PAPER,
        KycStatus.PENDING,
        KycStatus.ACCEPT,
      ]),
    }
    if (idDocumentType == KycIdDocumentType.ID_CARD) {
      condition.countryId = countryId
    }
    if (exceptUserId) {
      condition.userId = Not(exceptUserId)
    }
    const existedUserKyc = await this.userKycRepository.findOne({
      where: condition,
    })

    return !!existedUserKyc
  }

  async getKycByHistoryId(userKycHistoryId: string) {
    return await this.userKycRepository.findOne({
      where: { userKycHistoryId: userKycHistoryId },
    })
  }

  async checkUserHavePendingKyc(userId: string) {
    const existingKyc = await this.getKycByUserId(userId)
    return {
      pending: existingKyc && existingKyc.status != KycStatus.REJECT,
      userKyc: existingKyc,
    }
  }

  async saveUserKyc(userKycDto: CreateUserKycDto) {
    const existingKyc = await this.getKycByUserId(userKycDto.userId)
    const userKyc = plainToClass(
      UserKyc,
      { ...existingKyc, ...userKycDto },
      {
        exposeUnsetFields: false,
      },
    )
    if (!KycImageProvider[userKyc.imageProvider]) {
      userKyc.imageProvider = KycImageProvider.AMAZON
    }
    if (!KycRiskScanProvider[userKyc.riskScanProvider]) {
      userKyc.riskScanProvider = KycRiskScanProvider.CYNOPSIS
    }
    return await this.userKycRepository.save(userKyc)
  }

  async updateUserKyc(userKycId: string, updateUserKycDto: UpdateUserKycDto) {
    const userKycToUpdate = plainToClass(UserKyc, updateUserKycDto, {
      ignoreDecorators: true,
      exposeUnsetFields: false,
    })
    return this.userKycRepository.update({ id: userKycId }, userKycToUpdate)
  }

  async getListPersonalKyc(userKycFilter: IUserKycFilter) {
    const query = this.buildListPersonalKycQuery(userKycFilter)

    const options: IPaginationOptions = {
      page: userKycFilter.page || 1,
      limit: userKycFilter.perPage || 20,
      paginationType: PaginationTypeEnum.LIMIT_AND_OFFSET,
    }

    return await paginateRaw(query, options)
  }

  async getListEnterpriseKyc(userKycFilter: IUserKycFilter) {
    const query = this.buildListEnterpriseKycQuery(userKycFilter)

    const options: IPaginationOptions = {
      page: userKycFilter.page || 1,
      limit: userKycFilter.perPage || 20,
      paginationType: PaginationTypeEnum.LIMIT_AND_OFFSET,
    }

    return await paginateRaw(query, options)
  }

  private buildListPersonalKycQuery(userKycFilter: IUserKycFilter) {
    const query = this.userKycRepository
      .createQueryBuilder('user_kyc')
      .leftJoin('user', 'user', 'user_kyc.user_id = user.id')
      .leftJoin(
        'user_kyc_history',
        'user_kyc_history',
        'user_kyc_history.id = user_kyc.user_kyc_history_id',
      )
      .leftJoin(
        'user_info_history',
        'user_info_history',
        'user_info_history.id = user_kyc_history.user_info_history_id',
      )
      .select([
        'user_kyc.id as user_kyc_id',
        'user_kyc.userId as user_id',
        'user_kyc.status as status',
        'user_kyc.riskRating as risk_rating',
        'user.email as email',
        'user.lastLogin as last_login',
        'user_kyc_history.createdAt as created_at',
        'user_info_history.countryId as country_id',
        'user_info_history.fullName as full_name',
      ])
      .addSelect(
        'CONCAT("+", user_info_history.phoneCountry, user_info_history.phone)',
        'tel',
      )
      .where('user_kyc.type = :type', { type: KycType.PERSONAL })

    if (userKycFilter.status) {
      query.andWhere('user_kyc.status = :status', {
        status: userKycFilter.status,
      })
    }

    if (userKycFilter.userId) {
      query.andWhere('user_kyc.user_id = :userId', {
        userId: userKycFilter.userId,
      })
    }

    if (userKycFilter.searchKey) {
      query.andWhere(
        new Brackets((qb) => {
          if (
            !userKycFilter.selectedSearch ||
            !PERSONAL_KYC_SEARCH_FIELD_MAP[userKycFilter.selectedSearch]
          ) {
            qb.where('user.email LIKE :keyword')
              .orWhere('user_info_history.full_name LIKE :keyword')
              .orWhere(
                'CONCAT("+", user_info_history.phoneCountry, user_info_history.phone) LIKE :keyword',
              )
          } else {
            qb.where(
              `${
                PERSONAL_KYC_SEARCH_FIELD_MAP[userKycFilter.selectedSearch]
              } LIKE :keyword`,
            )
          }
        }),
        {
          keyword: `%${escapeLikeChars(userKycFilter.searchKey)}%`,
        },
      )
    }

    switch (userKycFilter.type) {
      case KycFilterType.APPROVED:
        query.andWhere('user_kyc.status = :statusType', {
          statusType: KycStatus.ACCEPT,
        })
        break
      case KycFilterType.UNAPPROVED:
        query.andWhere('user_kyc.status NOT IN(:...statusType)', {
          statusType: [
            KycStatus.ACCEPT,
            KycStatus.REJECT,
            KycStatus.PENDING_PAPER,
            KycStatus.PENDING,
          ],
        })
        break
      case KycFilterType.INADEQUACY:
        query.andWhere('user_kyc.status = :statusType', {
          statusType: KycStatus.REJECT,
        })
        break
      case KycFilterType.OTHER:
        query.andWhere('user_kyc.status IN(:...statusType)', {
          statusType: [KycStatus.PENDING_PAPER, KycStatus.PENDING],
        })
        break
      default:
        break
    }

    if (userKycFilter.sort && PERSONAL_KYC_SORT_FIELD_MAP[userKycFilter.sort]) {
      query.orderBy(
        PERSONAL_KYC_SORT_FIELD_MAP[userKycFilter.sort],
        userKycFilter.sortType || 'ASC',
      )
    } else {
      query.orderBy('user_kyc_history.createdAt', 'DESC')
    }
    query.addOrderBy('user.id', 'ASC')

    return query
  }

  private buildListEnterpriseKycQuery(userKycFilter: IUserKycFilter) {
    const query = this.userKycRepository
      .createQueryBuilder('user_kyc')
      .leftJoin('user', 'user', 'user_kyc.user_id = user.id')
      .leftJoin(
        'user_kyc_history',
        'user_kyc_history',
        'user_kyc_history.id = user_kyc.user_kyc_history_id',
      )
      .leftJoin(
        'enterprise_info',
        'enterprise_info',
        'enterprise_info.user_id = user.id',
      )
      .select([
        'user_kyc.id as user_kyc_id',
        'user_kyc.userId as user_id',
        'user_kyc.status as status',
        'user_kyc.riskRating as risk_rating',
        'user.email as login_email',
        'user.lastLogin as last_login',
        'enterprise_info.applicantName as applicant_name',
        'enterprise_info.companyName as company_name',
        'enterprise_info.contactNumber as contact_number',
        'user_kyc_history.createdAt as created_at',
        'enterprise_info.companyRegisterCountry as company_register_country',
      ])
      .where('user_kyc.type = :type', { type: KycType.ENTERPRISE })

    if (userKycFilter.status) {
      query.andWhere('user_kyc.status = :status', {
        status: userKycFilter.status,
      })
    }

    if (userKycFilter.userId) {
      query.andWhere('user_kyc.user_id = :userId', {
        userId: userKycFilter.userId,
      })
    }

    if (userKycFilter.searchKey) {
      query.andWhere(
        new Brackets((qb) => {
          if (
            !userKycFilter.selectedSearch ||
            !ENTERPRISE_KYC_SEARCH_FIELD_MAP[userKycFilter.selectedSearch]
          ) {
            qb.where('user.email LIKE :keyword')
              .orWhere('enterprise_info.applicant_name LIKE :keyword')
              .orWhere('enterprise_info.company_name LIKE :keyword')
              .orWhere('enterprise_info.contact_number LIKE :keyword')
          } else {
            qb.where(
              `${
                ENTERPRISE_KYC_SEARCH_FIELD_MAP[userKycFilter.selectedSearch]
              } LIKE :keyword`,
            )
          }
        }),
        {
          keyword: `%${escapeLikeChars(userKycFilter.searchKey)}%`,
        },
      )
    }

    switch (userKycFilter.type) {
      case KycFilterType.APPROVED:
        query.andWhere('user_kyc.status = :statusType', {
          statusType: KycStatus.ACCEPT,
        })
        break
      case KycFilterType.UNAPPROVED:
        query.andWhere('user_kyc.status NOT IN(:...statusType)', {
          statusType: [
            KycStatus.ACCEPT,
            KycStatus.REJECT,
            KycStatus.PENDING_PAPER,
            KycStatus.PENDING,
          ],
        })
        break
      case KycFilterType.INADEQUACY:
        query.andWhere('user_kyc.status = :statusType', {
          statusType: KycStatus.REJECT,
        })
        break
      case KycFilterType.OTHER:
        query.andWhere('user_kyc.status IN(:...statusType)', {
          statusType: [KycStatus.PENDING_PAPER, KycStatus.PENDING],
        })
        break
      default:
        break
    }

    if (
      userKycFilter.sort &&
      ENTERPRISE_KYC_SORT_FIELD_MAP[userKycFilter.sort]
    ) {
      query.orderBy(
        ENTERPRISE_KYC_SORT_FIELD_MAP[userKycFilter.sort],
        userKycFilter.sortType || 'ASC',
      )
    } else {
      query.orderBy('user_kyc_history.createdAt', 'DESC')
    }
    query.addOrderBy('user.id', 'ASC')

    return query
  }

  async updateIdDocumentNo(userId: string, idDocumentNo: string) {
    await this.userKycRepository.update({ userId }, { idDocumentNo })
  }
}
