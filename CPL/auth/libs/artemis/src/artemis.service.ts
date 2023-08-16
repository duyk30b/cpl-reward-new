import { HttpStatus, Injectable, Logger } from '@nestjs/common'
import { lastValueFrom, Observable, retryWhen } from 'rxjs'
import { ConfigService } from '@nestjs/config'
import { HttpService } from '@nestjs/axios'
import { KycIdDocumentType, KycType } from '@lib/user-kyc/enum/user-kyc.enum'
import { genericRetryStrategy } from '@lib/util'
import { UserKycCynopsis } from '@lib/user-kyc-cynopsis/entities/user-kyc-cynopsis.entity'
import { ArtemisSearchType } from './artemis.enum'
import { Gender } from '@lib/util'
import { UserKyc } from '@lib/user-kyc/entities/user-kyc.entity'
import { User } from '@lib/user/entities/user.entity'
import { UserInfo } from '@lib/user/entities/user-info.entity'
import { EnterpriseInfo } from '@lib/user/entities/enterprise-info.entity'
import { AuthSettingService } from '@lib/grpc-client/auth-setting'
import { ICountryResponse } from '@lib/grpc-client/auth-setting/auth-setting.interface'

const UNKNOWN = 'UNKNOWN'

const GENDER_MAP = {
  [Gender.MALE]: 'MALE',
  [Gender.FEMALE]: 'FEMALE',
  [Gender.OTHER]: UNKNOWN,
}

@Injectable()
export class ArtemisService {
  private nameKeyArtemis: string
  private readonly logger = new Logger(ArtemisService.name)

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly authSettingService: AuthSettingService,
  ) {
    this.nameKeyArtemis = this.configService.get('cynopsis.name_key_artemis')
  }

  async createCustomer(
    token,
    userKyc: UserKyc,
    user: User,
    userInfo: UserInfo,
    enterpriseInfo: EnterpriseInfo,
  ) {
    const createCustomerUrl = this.configService.get(
      'cynopsis.create_an_individual_customer_api_url',
    )

    const payload = await this.createArtemisPayload(
      userKyc,
      user,
      userInfo,
      enterpriseInfo,
    )

    try {
      const result = await lastValueFrom(
        this.httpService
          .post(createCustomerUrl, JSON.stringify(payload), {
            headers: {
              Authorization: 'Bearer ' + token,
              'Content-Type': 'application/json',
              'X-ARTEMIS-DOMAIN': 1,
            },
          })
          .pipe(
            retryWhen(
              genericRetryStrategy({
                excludedStatusCodes: [HttpStatus.BAD_REQUEST],
              }),
            ),
          ),
      )
      if (result && result.data && result.data.id) {
        return result.data.id
      } else {
        return null
      }
    } catch (e) {
      this.logger.error(e.response)
      //this.logger.error(e, e.stack)
    }

    return null
  }

  async getRecordAndCrpId(customerId: number, token) {
    const getResultUrl = this.configService
      .get('cynopsis.get_record_id_api_url')
      .replace('{{customer_id}}', customerId)

    try {
      const result = await lastValueFrom(
        this.httpService.get(getResultUrl, {
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
            'X-ARTEMIS-DOMAIN': 1,
          },
        }),
      )
      if (
        result &&
        result.data &&
        result.data.results &&
        result.data.results[0].record
      ) {
        return result.data.results[0]
      } else {
        this.logger.warn('Cannot get record id of customer id ' + customerId)
      }
    } catch (e) {
      this.logger.warn('Cannot get recordId of customerId ' + customerId)
      this.logger.warn(e)
      return null
    }
  }

  async postSearchRequest(type, recordId, token) {
    const searchRequestUrl = this.configService
      .get('cynopsis.post_screening_db_api_url')
      .replace('{{record_id}}', recordId)

    const params = {
      searchText: '',
      recordType: '',
      baseUrl: '',
      engineType: type,
      engineVersion: '',
      valid: true,
      invalidReason: '',
      record: '',
    }
    try {
      const result = await lastValueFrom(
        this.httpService.post(searchRequestUrl, params, {
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
            'X-ARTEMIS-DOMAIN': 1,
          },
        }),
      )
      if (result) {
        return true
      } else {
        this.logger.warn('Cannot send search request for record id ' + recordId)
      }
    } catch (e) {
      this.logger.warn('Cannot send search request for recordId' + recordId)
      this.logger.warn(e)
    }
    return false
  }
  async getSearchResult(type, recordId, token) {
    //Example: https://a2-castleou-prod-be.cynopsis.co/client/records/553/searches/?engine_type=ArtemiScan
    let getRecordUrl = this.configService
      .get('cynopsis.post_screening_db_api_url')
      .replace('{{record_id}}', recordId)
    getRecordUrl += '?engine_type=' + type

    try {
      const result = await lastValueFrom(
        this.httpService.get(getRecordUrl, {
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
            'X-ARTEMIS-DOMAIN': 1,
          },
        }),
      )
      if (result && result.data) {
        return result.data
      } else {
        this.logger.warn('Cannot get search result of record id ' + recordId)
      }
    } catch (e) {
      this.logger.warn('Cannot get search result of recordId ' + recordId)
      this.logger.warn(e)
    }
    return null
  }

  async postInternetSearchRequest(recordId, token) {
    const searchRequestUrl = this.configService
      .get('cynopsis.post_screening_internet_api_url')
      .replace('{{record_id}}', recordId)

    const params = {
      valid: true,
      invalidReason: '',
      record: '',
      baseUrl: '',
    }

    try {
      const result = await lastValueFrom(
        this.httpService.post(searchRequestUrl, params, {
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
            'X-ARTEMIS-DOMAIN': 1,
          },
        }),
      )
      if (result) {
        return true
      } else {
        this.logger.warn(
          'Cannot send internet search request for recordId ' + recordId,
        )
      }
    } catch (e) {
      this.logger.warn(
        'Cannot send internet search request for recordId ' + recordId,
      )
      this.logger.warn(e)
    }
    return false
  }
  async getInternetSearchResult(recordId, token) {
    const getResultUrl = this.configService
      .get('cynopsis.post_screening_internet_api_url')
      .replace('{{record_id}}', recordId)

    try {
      const result = await lastValueFrom(
        this.httpService.get(getResultUrl, {
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
            'X-ARTEMIS-DOMAIN': 1,
          },
        }),
      )
      if (result && result.data) {
        return result.data
      } else {
        this.logger.warn(
          'Cannot get internet search result of record id ' + recordId,
        )
      }
    } catch (e) {
      this.logger.warn(
        'Cannot get internet search result of recordId ' + recordId,
      )
      this.logger.warn(e)
    }
    return null
  }

  async postRiskReportRequest(customerId, token) {
    const riskReportUrl = this.configService
      .get('cynopsis.post_risk_report_api_url')
      .replace('{{customer_id}}', customerId)

    const params = {
      latestApprovalStatus: {
        overrideRisk: '',
        approvalStatus: '',
        riskReport: 0,
        notifyPerson: '',
      },
      riskRating: '',
      outdated: true,
      customer: 0,
    }

    try {
      const result = await lastValueFrom(
        this.httpService.post(riskReportUrl, params, {
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
            'X-ARTEMIS-DOMAIN': 1,
          },
        }),
      )
      if (result) {
        return true
      } else {
        this.logger.warn(
          'Cannot send risk report request for customer id ' + customerId,
        )
      }
    } catch (e) {
      this.logger.warn(
        'Cannot send risk report request for customerId' + customerId,
      )
      this.logger.warn(e)
    }
    return false
  }

  async getRiskReportResult(customerId, token) {
    const getResultUrl = this.configService
      .get('cynopsis.get_risk_report_api_url')
      .replace('{{customer_id}}', customerId)

    try {
      const result = await lastValueFrom(
        this.httpService.get(getResultUrl, {
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
            'X-ARTEMIS-DOMAIN': 1,
          },
        }),
      )
      if (result && result.data) {
        return result.data
      } else {
        this.logger.warn('Cannot get risk report of customer id ' + customerId)
      }
    } catch (e) {
      this.logger.warn('Cannot get get risk report customerId ' + customerId)
      this.logger.warn(e)
    }
    return null
  }

  async getAllCynopsisData(userKycCynopsis: UserKycCynopsis, token: string) {
    try {
      const [dowJones, artemiScan, internetSearch, riskReport] =
        await Promise.all([
          this.getSearchResult(
            ArtemisSearchType.DOW_JONES,
            userKycCynopsis.recordId,
            token,
          ),
          this.getSearchResult(
            ArtemisSearchType.ARTEMIS_SCAN,
            userKycCynopsis.recordId,
            token,
          ),
          this.getInternetSearchResult(userKycCynopsis.recordId, token),
          this.getRiskReportResult(userKycCynopsis.customerId, token),
        ])
      return {
        [ArtemisSearchType.DOW_JONES]: dowJones?.results,
        [ArtemisSearchType.ARTEMIS_SCAN]: artemiScan?.results,
        internetSearch: internetSearch?.results,
        riskReport: riskReport?.results,
      }
    } catch (e) {
      this.logger.error(e)
    }
  }

  async scanCynopsisData(recordId: number, customerId: number, token) {
    try {
      // Send screening request
      await this.postSearchRequest(
        ArtemisSearchType.ARTEMIS_SCAN,
        recordId,
        token,
      )
      await this.postSearchRequest(ArtemisSearchType.DOW_JONES, recordId, token)

      // Send internet search request
      await this.postInternetSearchRequest(recordId, token)

      // Wait until all async screenings are finished
      try {
        const dowJones = new Observable((subscriber) => {
          this.getSearchResult(
            ArtemisSearchType.DOW_JONES,
            recordId,
            token,
          ).then((data) => {
            if (
              data &&
              data.results &&
              data.results[0] &&
              data.results[0].isSearchFinished
            ) {
              subscriber.next(data)
              subscriber.complete()
            } else subscriber.error()
          })
        })
        const artemisScan = new Observable((subscriber) => {
          this.getSearchResult(
            ArtemisSearchType.ARTEMIS_SCAN,
            recordId,
            token,
          ).then((data) => {
            if (
              data &&
              data.results &&
              data.results[0] &&
              data.results[0].isSearchFinished
            ) {
              subscriber.next(data)
              subscriber.complete()
            } else subscriber.error()
          })
        })
        await Promise.all([
          lastValueFrom(dowJones.pipe(retryWhen(genericRetryStrategy()))),
          lastValueFrom(artemisScan.pipe(retryWhen(genericRetryStrategy()))),
        ])
      } catch (e) {
        this.logger.error(
          `Can not wait until all async screenings are finished with customer id: ${customerId}`,
        )
      }

      // Send risk report request
      await this.postRiskReportRequest(customerId, token)
    } catch (e) {
      this.logger.error(e)
    }
  }

  private async createArtemisPayload(
    userKyc: UserKyc,
    user: User,
    userInfo: UserInfo,
    enterpriseInfo: EnterpriseInfo,
  ) {
    const basePayload = {
      onboardingMode: UNKNOWN,
      productServiceComplexity: 'SIMPLE',
      paymentModes: [
        'TELEGRAPHIC TRANSFER',
        'CREDIT CARD',
        'VIRTUAL CURRENCY',
        UNKNOWN,
      ],
      profileType: '',
      isActiveCustomer: true,
      referenceId:
        'customer-' + this.nameKeyArtemis + '-id-' + userKyc.userKycHistoryId,
      domains: [1],
      users: [],
    }

    if (userKyc.type == KycType.ENTERPRISE && enterpriseInfo) {
      const country = await this.authSettingService.getCountryById({
        id: enterpriseInfo.companyRegisterCountry,
      })

      const corporateRecords = this.createCorporateRecords(
        user,
        userInfo,
        enterpriseInfo,
        country,
      )

      return {
        corporateRecords,
        ...basePayload,
      }
    } else {
      let idType = 'OTHERS'
      if (userKyc.idDocumentType == KycIdDocumentType.ID_CARD) {
        idType = 'NATIONAL ID'
      } else if (userKyc.idDocumentType == KycIdDocumentType.DRIVING_LICENCE) {
        idType = 'DRIVING LICENCE'
      } else if (userKyc.idDocumentType == KycIdDocumentType.PASSPORT) {
        idType = 'INTERNATIONAL PASSPORT'
      }

      const nationality = await this.authSettingService.getCountryById({
        id: userInfo.nationalityId,
      })

      const countryOfBirth = await this.authSettingService.getCountryById({
        id: userInfo.countryId,
      })

      const individualRecords = this.createIndividualRecords(
        userKyc,
        user,
        userInfo,
        idType,
        nationality,
        countryOfBirth,
      )

      return {
        individualRecords,
        ...basePayload,
      }
    }
  }

  private createIndividualRecords(
    userKyc: UserKyc,
    user: User,
    userInfo: UserInfo,
    idType: string,
    nationality: ICountryResponse,
    countryOfBirth: ICountryResponse,
  ) {
    return [
      {
        primary: true,
        name: userInfo.firstName + ' ' + userInfo.lastName,
        aliasNames: [],
        phoneNumbers: [userInfo.getPhoneNumber()],
        addresses: [userInfo.address],
        sourceOfFunds: '',
        emailAddresses: [user.email],
        bankAccounts: ['no'],
        gender: GENDER_MAP[userInfo.gender] || UNKNOWN,
        nationality: nationality?.nameArtemis || UNKNOWN,
        countryOfResidence: nationality?.nameArtemis || UNKNOWN,
        title: '',
        countryOfBirth: countryOfBirth?.nameArtemis || UNKNOWN,
        dateOfBirth: userInfo.birthday,
        industry: 'UNKNOWN - UNKNOWN',
        occupation: 'UNKNOWN - UNKNOWN',
        idType: idType,
        idNumber: userKyc.idDocumentNo,
      },
    ]
  }

  private createCorporateRecords(
    user: User,
    userInfo: UserInfo,
    enterpriseInfo: EnterpriseInfo,
    country: ICountryResponse,
  ) {
    return [
      {
        primary: true,
        name: userInfo.firstName + ' ' + userInfo.lastName,
        aliasNames: [],
        phoneNumbers: [userInfo.getPhoneNumber()],
        addresses: [userInfo.address],
        sourceOfFunds: '',
        emailAddresses: [user.email],
        isIncorporated: true,
        entityType: enterpriseInfo.entityType,
        countryOfOperations: country?.nameArtemis || UNKNOWN,
        countryOfIncorporation: country?.nameArtemis || UNKNOWN,
        ownershipStructureLayers: enterpriseInfo.ownershipStructureLayer,
        incorporationNumber: enterpriseInfo.incorporationNumber,
        website: enterpriseInfo.urlWebsite,
        inFatfJurisdiction: true,
      },
    ]
  }
}
