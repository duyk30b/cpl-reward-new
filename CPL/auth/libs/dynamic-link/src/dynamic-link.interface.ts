export interface IDynamicLinkInfo {
  link: string
  // androidInfo
  androidFallbackLink?: string
  androidMinPackageVersionCode?: string
  // iosInfo
  iosFallbackLink?: string
  iosCustomScheme?: string
  iosIpadFallbackLink?: string
  // navigationInfo
  enableForcedRedirect?: boolean
  // analyticsInfo - googlePlayAnalytics
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  // analyticsInfo - itunesConnectAnalytics
  at?: string
  ct?: string
  mt?: string
  pt?: string
  // socialMetaTagInfo
  socialTitle?: string
  socialDescription?: string
  socialImageLink?: string
  suffix?: string
}

export class analyticsInfoResponse {
  googlePlayAnalytics?: {
    utmSource?: string
    utmMedium?: string
    utmCampaign?: string
    utmTerm?: string
    utmContent?: string
  }
  itunesConnectAnalytics?: {
    at?: string
    ct?: string
    mt?: string
    pt?: string
  }
}

export class SocialMetaTagInfoResponse {
  socialTitle?: string
  socialDescription?: string
  socialImageLink?: string
}

export class AndroidInfoResponse {
  androidPackageName?: string
  androidFallbackLink?: string
  androidMinPackageVersionCode?: string
}

export class IosInfoResponse {
  iosBundleId?: string
  iosFallbackLink?: string
  iosCustomScheme?: string
  iosIpadFallbackLink?: string
  iosIpadBundleId?: string
  iosAppStoreId?: string
}

export class NavigationInfoResponse {
  enableForcedRedirect?: boolean
}

export class DynamicLinkInfoBody {
  domainUriPrefix: string
  link: string
  androidInfo?: {
    androidPackageName?: string
    androidFallbackLink?: string
    androidMinPackageVersionCode?: string
  }
  iosInfo?: {
    iosBundleId?: string
    iosIpadBundleId?: string
    iosAppStoreId?: string
    iosFallbackLink?: string
    iosCustomScheme?: string
    iosIpadFallbackLink?: string
  }
  navigationInfo?: {
    enableForcedRedirect?: boolean
  }
  analyticsInfo?: {
    googlePlayAnalytics?: {
      utmSource?: string
      utmMedium?: string
      utmCampaign?: string
      utmTerm?: string
      utmContent?: string
    }
    itunesConnectAnalytics?: {
      at?: string
      ct?: string
      mt?: string
      pt?: string
    }
  }
  socialMetaTagInfo?: {
    socialTitle?: string
    socialDescription?: string
    socialImageLink?: string
  }
}

export interface error {
  code: number
  message: string
  status: string
}

export interface DynamicLinkResponse {
  result: boolean
  warning?: WarningDynamicLinkResponse[]
  error?: ErrorDynamicLinkResponse
  data?: SuccessDynamicLinkResponse
}

interface WarningDynamicLinkResponse {
  warningCode: string
  warningMessage: string
}
interface ErrorDynamicLinkResponse {
  code: number
  status: string
  message: string
}
interface SuccessDynamicLinkResponse {
  shortLink: string
  previewLink: string
}
