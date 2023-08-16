import { KycImageProvider } from '@lib/user-kyc/enum/user-kyc.enum'

export default () => ({
  kyc: {
    rekognition_face_collection: `${process.env.ENV}_${
      process.env.KYC_REKOGNITION_FACE_COLLECTION ||
      'KYC_REKOGNITION_FACE_COLLECTION'
    }`,

    // Những config bên dưới sau này sẽ chuyển vào lưu db để admin có thể thay đổi
    personalImageProviders: process.env.PERSONAL_KYC_IMAGE_PROVIDERS
      ? process.env.PERSONAL_KYC_IMAGE_PROVIDERS.split(',').map((e) =>
          parseInt(e),
        )
      : [KycImageProvider.AMAZON, KycImageProvider.SUMSUB],
    enterpriseImageProviders: process.env.ENTERPRISE_KYC_IMAGE_PROVIDERS
      ? process.env.ENTERPRISE_KYC_IMAGE_PROVIDERS.split(',').map((e) =>
          parseInt(e),
        )
      : [KycImageProvider.AMAZON],
    personalRiskScanProviders: process.env.PERSONAL_KYC_RISK_SCAN_PROVIDERS
      ? process.env.PERSONAL_KYC_RISK_SCAN_PROVIDERS.split(',').map((e) =>
          parseInt(e),
        )
      : [],
    enterpriseRiskScanProviders: process.env.ENTERPRISE_KYC_RISK_SCAN_PROVIDERS
      ? process.env.ENTERPRISE_KYC_RISK_SCAN_PROVIDERS.split(',').map((e) =>
          parseInt(e),
        )
      : [],
    compareFaceThreshold: +process.env.KYC_COMPARE_FACE_THRESHOLD || 90,
    maxFacesFind: +process.env.KYC_MAX_FACES_FIND || 25,
    maxSumsubAutoReject: +process.env.KYC_SUMSUB_MAX_AUTO_REJECT || 3,
    duplicateFaceAdminRejectThreshold:
      +process.env.KYC_DUPLICATE_FACE_ADMIN_REJECT_THRESHOLD || 99,
    duplicateFaceAutoRejectThreshold:
      +process.env.KYC_DUPLICATE_FACE_AUTO_REJECT_THRESHOLD || 90,
    duplicateFaceWarningThreshold:
      +process.env.KYC_DUPLICATE_FACE_WARNING_THRESHOLD || 60,
  },
})
