import { UserKycHistory } from '@lib/user-kyc/entities/user-kyc-history.entity'
import { UserKyc } from '@lib/user-kyc/entities/user-kyc.entity'
import {
  CompareStatus,
  DuplicateStatus,
  IdentityDocumentVerificationStatus,
  KycImageProvider,
  LivenessStatus,
} from '@lib/user-kyc/enum/user-kyc.enum'

export interface IKycProviderService {
  process(userKyc: UserKyc): Promise<void>
  getFinalDecision(userKyc: UserKyc): Promise<KycProviderDecision>
  getBestDecision(): KycProviderDecision
  logicAfterReject(userKyc: UserKyc): Promise<void>
}

export interface IKycImageProviderService extends IKycProviderService {
  deleteFaceIndex(userKycHistory: UserKycHistory): Promise<void>
  getProcessResult(
    userKycHistory: UserKycHistory,
  ): Promise<IKycImageProcessResult>
}

export type IKycRiskProviderService = IKycProviderService

// Sắp xếp theo tính chất của hành động từ nhẹ đến nặng
export enum KycProviderDecision {
  ADMIN_ACCEPT = 1,
  AUTO_KYC_PASS = 2,
  AUTO_KYC_REJECT = 3,
  ADMIN_REJECT = 4,
  BAN = 5,
}

export interface IKycImageProcessResult {
  provider: KycImageProvider
  compareStatus?: CompareStatus
  duplicateStatus?: DuplicateStatus
  livenessStatus?: LivenessStatus
  identityDocumentVerificationStatus?: IdentityDocumentVerificationStatus
  resultStatus?: KycProviderResultStatus
  resultText?: string
}

export enum KycProviderResultStatus {
  PASS = 1,
  FAIL = 2,
}
