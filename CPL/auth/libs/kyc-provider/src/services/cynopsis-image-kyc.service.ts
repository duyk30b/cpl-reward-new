/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger } from '@nestjs/common'
import { UserKycCynopsisService } from '@lib/user-kyc-cynopsis'
import { UploadFileService } from '@lib/upload-file'
import { AresService } from '@lib/ares'
import {
  IKycImageProcessResult,
  IKycImageProviderService,
  KycProviderDecision,
} from '../kyc-provider.type'
import { UserKyc } from '@lib/user-kyc/entities/user-kyc.entity'
import {
  CompareStatus,
  KycImageProvider,
} from '@lib/user-kyc/enum/user-kyc.enum'
import { getFaceFile, getFrontDocumentFile } from '@lib/util'
import { UserKycHistory } from '@lib/user-kyc/entities/user-kyc-history.entity'

@Injectable()
export class CynopsisImageKycService implements IKycImageProviderService {
  private readonly logger = new Logger(CynopsisImageKycService.name)

  constructor(
    private readonly userKycCynopsis: UserKycCynopsisService,
    private readonly aresService: AresService,
    private readonly uploadFileService: UploadFileService,
  ) {}

  async process(userKyc: UserKyc) {
    const faceCompareResult = await this.compareFaceVsPaper(userKyc)

    const cynopsisEntity = await this.userKycCynopsis.getCynopsisByHistoryId(
      userKyc.userKycHistoryId,
    )

    await this.userKycCynopsis.updateCynopsisOcrStatus(
      cynopsisEntity,
      faceCompareResult,
    )
  }

  private async compareFaceVsPaper(userKyc: UserKyc) {
    const files = userKyc.files
    const faceFile = getFaceFile(userKyc)
    const frontDocumentFile = getFrontDocumentFile(userKyc)

    if (!faceFile || !frontDocumentFile) {
      return CompareStatus.ERROR
    }

    // Get Public URL
    const faceUrl = await this.uploadFileService.getPublicUrl(faceFile.name)
    const frontDocumentUrl = await this.uploadFileService.getPublicUrl(
      frontDocumentFile.name,
    )

    if (!faceUrl || !frontDocumentUrl) {
      this.logger.error(
        'KYC Face compare error due to getPublicUrl of image ' +
          JSON.stringify(files),
      )
      return CompareStatus.ERROR
    }

    // Send to Ares to compare
    const compareResult = await this.aresService.aresCompareOcr(
      faceUrl,
      frontDocumentUrl,
    )
    if (!compareResult || !compareResult.status) {
      return CompareStatus.ERROR
    } else if (compareResult.status === 'MATCHED') {
      return CompareStatus.MATCHED
    } else if (compareResult.status === 'NOT MATCHED') {
      return CompareStatus.NOT_MATCHED
    } else if (compareResult.status == 'UNCERTAIN') {
      return CompareStatus.UNCERTAIN
    }
    return CompareStatus.UNCERTAIN
  }

  async getFinalDecision(userKyc: UserKyc): Promise<KycProviderDecision> {
    return KycProviderDecision.AUTO_KYC_PASS
  }

  getBestDecision(): KycProviderDecision {
    return KycProviderDecision.AUTO_KYC_PASS
  }

  async deleteFaceIndex(userKycHistory: UserKycHistory) {
    return
  }

  async logicAfterReject(userKyc: UserKyc): Promise<void> {
    return
  }

  async getProcessResult(
    userKycHistory: UserKycHistory,
  ): Promise<IKycImageProcessResult> {
    const cynopsis = await this.userKycCynopsis.getCynopsisByHistoryId(
      userKycHistory.id,
    )
    return {
      provider: KycImageProvider.CYNOPSIS,
      compareStatus: cynopsis?.ocrStatus || CompareStatus.UNCERTAIN,
    }
  }
}
