import { Processor, Process } from '@nestjs/bull'
import { Job } from 'bull'
import { MultipartUploaderService } from '@lib/upload-file'
import { UtilService } from '@lib/util'
import { stringify } from 'csv-stringify/sync'
import { NewAdminUserForManagementDto } from '@lib/user/dto/new-admin-user-for-management.dto'
import {
  UserAuthenticatorVerifyStatus,
  UserInfoStatus,
} from '@lib/user/enum/user.enum'
import { RiskRating, KycStatus } from '@lib/user-kyc/enum/user-kyc.enum'
import { NewAdminUserService } from '@lib/user/services/new-admin-user.service'
import { UserForMarketingDto } from '@lib/user/dto/user-for-marketing.dto'
import {
  EXPORT_USER_QUEUE,
  EXPORT_USER_TAG_QUEUE,
} from '@lib/redis-queue/redis-queue.variable'

@Processor(EXPORT_USER_QUEUE)
export class ExportUserConsumers {
  private readonly csvHeader = [
    'Email',
    'User Name',
    'Referral Email',
    'Registered Information',
    'Account Level',
    'Level Status',
    'Social Link',
    'Set 2FA',
    'Registered Date',
    'Last Login',
    'Risk Rating',
  ]

  private readonly infoStatusTranslate = {
    [UserInfoStatus.NOT_UPDATED]: 'Not yet',
    [UserInfoStatus.UPDATED]: 'Already',
  }

  private readonly socialLinkTranslate = {
    1: 'Already',
    0: 'Not yet',
  }

  private readonly authenticatorVerifyStatusTranslate = {
    [UserAuthenticatorVerifyStatus.UNVERIFIED]: 'Disable',
    [UserAuthenticatorVerifyStatus.VERIFIED]: 'Enable',
  }

  private readonly riskRatingTranslate = {
    [RiskRating.FAIL_INFO]: 'FAIL INFO',
    [RiskRating.LOW]: 'LOW',
    [RiskRating.MEDIUM]: 'MEDIUM',
    [RiskRating.HIGH]: 'HIGH',
    [RiskRating.SCREENING]: 'SCREENING',
    [RiskRating.UNKNOWN]: 'UNKNOWN',
    HIGH: 'HIGH',
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    UNKNOWN: 'UNKNOWN',
  }

  private readonly levelStatusTranslate = {
    1: 'Just Registered',
    2: 'Email Verified',
    3: {
      1: 'Waiting For Auto KYC',
      2: 'Auto KYC Rejected',
      3: 'Admin Rejected',
    },
    4: 'Auto KYC Passed',
    5: 'Admin Accepted',
  }

  constructor(
    private readonly adminService: NewAdminUserService,
    private readonly uploadService: MultipartUploaderService,
    private readonly utilService: UtilService,
  ) {}

  parseAccountLevelStatus(accountLv: number, kycStatus: number) {
    if (accountLv == 3) {
      let lvStatus = 2
      if (kycStatus == KycStatus.NEW) {
        lvStatus = 1
      } else if (kycStatus == KycStatus.REJECT) {
        lvStatus = 3
      }

      return this.levelStatusTranslate[accountLv][lvStatus]
        ? this.levelStatusTranslate[accountLv][lvStatus]
        : 'Unknown'
    }

    return this.levelStatusTranslate[accountLv]
      ? this.levelStatusTranslate[accountLv]
      : 'Unknown'
  }

  extractCsvRow = (user: NewAdminUserForManagementDto) => {
    return [
      user.email,
      user.fullName,
      user.referralEmail,
      this.infoStatusTranslate[user.userInfoStatus],
      user.accountLv,
      this.parseAccountLevelStatus(user.accountLv, user.kycStatus),
      this.socialLinkTranslate[user.socialLink],
      this.authenticatorVerifyStatusTranslate[user.authenticatorVerifyStatus],
      this.utilService.convertTimestampToDate(user.createdAt, 'DD/MM/YYYY'),
      this.utilService.convertTimestampToDate(user.lastLogin, 'DD/MM/YYYY'),
      this.riskRatingTranslate[user.riskRating],
    ]
  }

  @Process()
  async exportUsersToCsv(job: Job<unknown>) {
    const limit = 5000
    let currentPage = 0
    let totalRecord = 1

    try {
      await this.uploadService.createMultiplePartUpload('export/users/', 'csv')
      await this.uploadService.addData(stringify([this.csvHeader]))

      do {
        const filterParam = {
          ...(job.data as Record<string, unknown>),
          page: currentPage + 1,
          perPage: limit,
        }

        const usersData = await this.adminService.getListUserForManagement(
          filterParam,
        )
        totalRecord = usersData.pagination.total
        currentPage++

        const csvString = stringify(usersData.data.map(this.extractCsvRow))
        await this.uploadService.addData(csvString)
      } while (currentPage * limit < totalRecord)

      await this.uploadService.completeMultiplePartUpload()
      const link = await this.uploadService.getPublicUrl()

      return { link: link }
    } catch (error) {
      await this.uploadService.abortMultiplePartUpload()
      job.moveToFailed({ message: error })
    }

    return {}
  }
}

@Processor(EXPORT_USER_TAG_QUEUE)
export class ExportUserMarketingConsumers {
  constructor(
    private readonly adminService: NewAdminUserService,
    private readonly uploadService: MultipartUploaderService,
    private readonly utilService: UtilService,
  ) {}

  private readonly csvHeader = [
    'ID',
    'Email',
    'User Name',
    'Account Level',
    'Registered Channel',
    'Registered Date',
    'Tags',
  ]

  extractCsvRow = (user: UserForMarketingDto) => {
    return [
      user.userId,
      user.email,
      user.fullName,
      user.accountLv,
      user.channelName,
      this.utilService.convertTimestampToDate(user.createdAt, 'YYYY/MM/DD'),
      user?.tags?.length ? user.tags.join(', ') : '',
    ]
  }

  @Process()
  async exportUsersTagToCsv(job: Job<unknown>) {
    const limit = 5000
    let currentPage = 0
    let totalRecord = 1

    try {
      await this.uploadService.createMultiplePartUpload(
        'export/users-marketing/',
        'csv',
      )
      await this.uploadService.addData(stringify([this.csvHeader]))

      do {
        const filterParam = {
          ...(job.data as Record<string, unknown>),
          page: currentPage + 1,
          perPage: limit,
        }

        const usersData = await this.adminService.getListUserForMarketing(
          filterParam,
        )
        totalRecord = usersData.pagination.total
        currentPage++

        const csvString = stringify(usersData.data.map(this.extractCsvRow))
        await this.uploadService.addData(csvString)
      } while (currentPage * limit < totalRecord)

      await this.uploadService.completeMultiplePartUpload()
      const link = await this.uploadService.getPublicUrl()

      return { link: link }
    } catch (error) {
      await this.uploadService.abortMultiplePartUpload()
      job.moveToFailed({ message: error })
    }

    return {}
  }
}
