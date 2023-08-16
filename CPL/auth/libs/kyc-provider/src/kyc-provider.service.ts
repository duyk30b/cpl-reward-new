import {
  KycImageProvider,
  KycRiskScanProvider,
} from '@lib/user-kyc/enum/user-kyc.enum'
import { Injectable, Logger } from '@nestjs/common'
import {
  IKycImageProviderService,
  IKycRiskProviderService,
} from './kyc-provider.type'
import { AmazonKycService } from './services/amazon-kyc.service'
import { CynopsisImageKycService } from './services/cynopsis-image-kyc.service'
import { CynopsisRiskKycService } from './services/cynopsis-risk-kyc.service'
import { SumsubKycService } from './services/sumsub-kyc.service'

@Injectable()
export class KycProviderService {
  private readonly logger = new Logger(KycProviderService.name)

  constructor(
    private readonly cynopsisImageKycService: CynopsisImageKycService,
    private readonly cynopsisRiskKycService: CynopsisRiskKycService,
    private readonly amazonKycService: AmazonKycService,
    private readonly sumsubKycService: SumsubKycService,
  ) {}

  getImageProvider(provider: number): IKycImageProviderService {
    if (provider == KycImageProvider.CYNOPSIS)
      return this.cynopsisImageKycService
    if (provider == KycImageProvider.AMAZON) return this.amazonKycService
    if (provider == KycImageProvider.SUMSUB) return this.sumsubKycService
    return this.amazonKycService
  }

  getRiskProvider(provider: number): IKycRiskProviderService {
    if (provider == KycRiskScanProvider.CYNOPSIS)
      return this.cynopsisRiskKycService
    return this.cynopsisRiskKycService
  }
}
