/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger } from '@nestjs/common'
import { UserKycCynopsisService } from '@lib/user-kyc-cynopsis'
import { EnterpriseInfoHistoryService, UserInfoHistoryService } from '@lib/user'
import { UserKycHistoryService, UserKycService } from '@lib/user-kyc'
import { UploadFileService } from '@lib/upload-file'
import { UserService } from '@lib/user'
import { UserInfoService } from '@lib/user'
import { ArtemisService } from '@lib/artemis'
import { AresService } from '@lib/ares'
import { AmazonCognitoService } from '@lib/amazon-cognito'
import { EnterpriseInfoService } from '@lib/user'
import { UserKycCynopsis } from '@lib/user-kyc-cynopsis/entities/user-kyc-cynopsis.entity'
import {
  IKycRiskProviderService,
  KycProviderDecision,
} from '../kyc-provider.type'
import { UserKyc } from '@lib/user-kyc/entities/user-kyc.entity'
import {
  CompareStatus,
  RiskRating,
  RiskScanStatus,
  KycType,
} from '@lib/user-kyc/enum/user-kyc.enum'

@Injectable()
export class CynopsisRiskKycService implements IKycRiskProviderService {
  private readonly logger = new Logger(CynopsisRiskKycService.name)

  constructor(
    private readonly userKycCynopsis: UserKycCynopsisService,
    private readonly userKycService: UserKycService,
    private readonly userKycHistoryService: UserKycHistoryService,
    private readonly userInfoHistoryService: UserInfoHistoryService,
    private readonly enterpriseInfoHistoryService: EnterpriseInfoHistoryService,
    private readonly artemisService: ArtemisService,
    private readonly userService: UserService,
    private readonly userInfoService: UserInfoService,
    private readonly enterpriseInfoService: EnterpriseInfoService,
    private readonly amazonCognitoService: AmazonCognitoService,
  ) {}

  async process(userKyc: UserKyc) {
    // await this.userKycService.updateUserKyc(userKyc.id, {
    //   riskRating: RiskRating.SCREENING,
    // })
    // const cynopsisData = await this.scanCynopsisData(userKyc)
    // await this.updateKycRiskRating(userKyc, cynopsisData)
  }

  private async scanCynopsisData(userKyc: UserKyc) {
    if (!userKyc.idDocumentNo) return
    const userKycHistoryId = userKyc.userKycHistoryId

    const user = await this.userService.getUserById(userKyc.userId)
    if (!user) {
      this.logger.error('Cannot find user of history ' + userKycHistoryId)
      return
    }

    const userInfo = await this.userInfoService.getInfoByUserId(userKyc.userId)
    if (!userInfo) {
      this.logger.error('Cannot find user info of history ' + userKycHistoryId)
      return
    }

    const enterpriseInfo =
      await this.enterpriseInfoService.getEnterpriseInfoByUserId(userKyc.userId)

    let userKycCynopsis = await this.userKycCynopsis.getCynopsisByHistoryId(
      userKycHistoryId,
    )

    if (userKycCynopsis.hasCynopsisData) return userKycCynopsis.cynopsisData

    let cynopsisData = null

    try {
      const needToScanCynopsis = await this.checkNeedToScanCynopsis(userKyc)
      if (needToScanCynopsis.result) {
        const token = await this.amazonCognitoService.getAccessToken()

        // Create Customer then get Customer ID
        const customerId = await this.artemisService.createCustomer(
          token,
          userKyc,
          user,
          userInfo,
          enterpriseInfo,
        )
        if (!customerId) {
          this.logger.error('Cannot create customer. Stop')
          return
        } else {
          userKycCynopsis = await this.userKycCynopsis.updateCynopsisCustomerId(
            userKycCynopsis,
            customerId,
          )
        }

        const recordAndCrpId = await this.artemisService.getRecordAndCrpId(
          customerId,
          token,
        )
        //const recordAndCrpId = { record: 553, id: 554 }
        if (!recordAndCrpId) {
          this.logger.error(
            'Cannot get recordAndCrpId of customerId ' + customerId,
          )
          return
        } else {
          this.logger.debug('Ok I got Record ID: ', recordAndCrpId)
          userKycCynopsis =
            await this.userKycCynopsis.updateCynopsisRecordAndCrpId(
              userKycCynopsis,
              recordAndCrpId,
            )
        }

        await this.artemisService.scanCynopsisData(
          recordAndCrpId.record,
          customerId,
          token,
        )

        cynopsisData = await this.artemisService.getAllCynopsisData(
          userKycCynopsis,
          token,
        )
      } else {
        const prevCynopsis = needToScanCynopsis.prevCynopsis
        await this.userKycCynopsis.updateCynopsisCustomerId(
          userKycCynopsis,
          prevCynopsis.customerId,
        )
        await this.userKycCynopsis.updateCynopsisRecordAndCrpId(
          userKycCynopsis,
          {
            record: prevCynopsis.recordId,
            id: prevCynopsis.crpId,
          },
        )
        cynopsisData = prevCynopsis.cynopsisData
      }
    } catch (e) {
      this.logger.error(
        `Fail to get cynopsis data for history id: ${userKyc.userKycHistoryId}`,
      )
      this.logger.error(e, e.stack)
    }

    await this.userKycCynopsis.updateCynopsisScanResult(
      userKycCynopsis,
      cynopsisData ? RiskScanStatus.DONE : RiskScanStatus.ERROR,
      cynopsisData,
    )

    return cynopsisData
  }

  private async updateKycRiskRating(userKyc: UserKyc, cynopsisData) {
    const riskReports = cynopsisData?.riskReport
    const riskReport = riskReports ? riskReports[0] : {}

    let riskRating = 'UNKNOWN'
    if (!cynopsisData) {
      riskRating = 'FAIL_INFO'
    } else {
      riskRating = (
        (riskReport?.riskJson?.riskRating as string) || 'UNKNOWN'
      ).toUpperCase()
    }
    await this.userKycService.updateUserKyc(userKyc.id, {
      riskRating: RiskRating[riskRating] || RiskRating.UNKNOWN,
    })
  }

  private async checkNeedToScanCynopsis(userKyc: UserKyc) {
    const data = {
      result: true,
      prevCynopsis: null as UserKycCynopsis,
    }
    const KYC_FIELDS = ['idDocumentNo', 'idDocumentType']
    const INFO_FIELDS = [
      'firstName',
      'lastName',
      'furigana1',
      'furigana2',
      'birthday',
      'phone',
      'phoneCountry',
      'buildingRoom',
      'address',
      'city',
      'stateRegion',
      'zipCode',
      'countryId',
      'nationalityId',
      'gender',
    ]
    const ENTERPRISE_INFO_FIELDS = [
      'entityType',
      'ownershipStructureLayer',
      'incorporationNumber',
      'urlWebsite',
    ]
    const kycHistories = await this.userKycHistoryService.getListUserKycHistory(
      userKyc.userId,
    )
    const currentKycHistory = kycHistories[0]
    const prevKycHistory = kycHistories[1]
    if (this.checkInfoChange(currentKycHistory, prevKycHistory, KYC_FIELDS)) {
      return data
    }

    const currentInfoHistory =
      await this.userInfoHistoryService.getUserInfoHistoryById(
        currentKycHistory?.userInfoHistoryId,
      )
    const prevInfoHistory =
      await this.userInfoHistoryService.getUserInfoHistoryById(
        prevKycHistory?.userInfoHistoryId,
      )
    if (
      this.checkInfoChange(currentInfoHistory, prevInfoHistory, INFO_FIELDS)
    ) {
      return data
    }

    if (userKyc.type == KycType.ENTERPRISE) {
      const currentEnterpriseInfoHistory =
        await this.enterpriseInfoHistoryService.getById(
          currentKycHistory?.enterpriseInfoHistoryId,
        )
      const prevEnterpriseInfoHistory =
        await this.enterpriseInfoHistoryService.getById(
          prevKycHistory?.enterpriseInfoHistoryId,
        )
      if (
        this.checkInfoChange(
          currentEnterpriseInfoHistory,
          prevEnterpriseInfoHistory,
          ENTERPRISE_INFO_FIELDS,
        )
      ) {
        return data
      }
    }

    const prevCynopsis = await this.userKycCynopsis.getCynopsisByHistoryId(
      prevKycHistory.id,
    )
    if (!prevCynopsis.hasCynopsisData) {
      return data
    }

    data.result = false
    data.prevCynopsis = prevCynopsis

    return data
  }

  private checkInfoChange(currentHistory, prevHistory, listFields: string[]) {
    if (!currentHistory || !prevHistory) return true
    for (let i = 0; i < listFields.length; i++) {
      const field = listFields[i]
      if (currentHistory[field] != prevHistory[field]) return true
    }
    return false
  }

  async getFinalDecision(userKyc: UserKyc): Promise<KycProviderDecision> {
    return KycProviderDecision.AUTO_KYC_PASS
  }

  getBestDecision(): KycProviderDecision {
    return KycProviderDecision.AUTO_KYC_PASS
  }

  async logicAfterReject(userKyc: UserKyc): Promise<void> {
    return
  }
}
