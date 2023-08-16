import { Injectable, Logger } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import {
  analyticsInfoResponse,
  AndroidInfoResponse,
  DynamicLinkInfoBody,
  DynamicLinkResponse,
  IDynamicLinkInfo,
  IosInfoResponse,
  NavigationInfoResponse,
  SocialMetaTagInfoResponse,
} from './dynamic-link.interface'
import { ConfigService } from '@nestjs/config'
import { SuffixOption } from '@lib/dynamic-link/dynamic-link.enum'
import { firstValueFrom, map } from 'rxjs'
import { classToPlain } from 'class-transformer'

@Injectable()
export class DynamicLinkService {
  private readonly logger = new Logger(DynamicLinkService.name)
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  private getAndroidInfo(
    dynamicLinkInfo: IDynamicLinkInfo,
  ): AndroidInfoResponse {
    const androidPackageName = this.configService.get(
      'dynamic_link.android_package_name',
    )

    const result = new AndroidInfoResponse()
    if (androidPackageName !== undefined)
      result.androidPackageName = androidPackageName

    const { androidFallbackLink, androidMinPackageVersionCode } =
      dynamicLinkInfo
    if (androidFallbackLink !== undefined)
      result.androidFallbackLink = androidFallbackLink

    if (androidMinPackageVersionCode !== undefined)
      result.androidMinPackageVersionCode = androidMinPackageVersionCode

    return Object.keys(result).length === 0 ? undefined : result
  }

  private getIosInfo(dynamicLinkInfo: IDynamicLinkInfo): IosInfoResponse {
    const iosBundleId = this.configService.get('dynamic_link.ios_bundle_id')
    const iosIpadBundleId = this.configService.get(
      'dynamic_link.ios_ipad_bundle_id',
    )
    const iosAppStoreId = this.configService.get(
      'dynamic_link.ios_app_store_id',
    )
    const result = new IosInfoResponse()
    if (iosBundleId !== undefined) result.iosBundleId = iosBundleId
    if (iosIpadBundleId !== undefined) result.iosIpadBundleId = iosIpadBundleId
    if (iosAppStoreId !== undefined) result.iosAppStoreId = iosAppStoreId

    const { iosFallbackLink, iosCustomScheme, iosIpadFallbackLink } =
      dynamicLinkInfo

    if (iosFallbackLink !== undefined) result.iosFallbackLink = iosFallbackLink
    if (iosCustomScheme !== undefined) result.iosCustomScheme = iosCustomScheme
    if (iosIpadFallbackLink !== undefined)
      result.iosIpadFallbackLink = iosIpadFallbackLink

    return Object.keys(result).length === 0 ? undefined : result
  }

  private static getNavigationInfo(
    dynamicLinkInfo: IDynamicLinkInfo,
  ): NavigationInfoResponse {
    const result = new NavigationInfoResponse()
    const { enableForcedRedirect } = dynamicLinkInfo
    if (enableForcedRedirect !== undefined)
      result.enableForcedRedirect = enableForcedRedirect

    return Object.keys(result).length === 0 ? undefined : result
  }

  private static getAnalyticsInfo(
    dynamicLinkInfo: IDynamicLinkInfo,
  ): analyticsInfoResponse {
    const result = new analyticsInfoResponse()

    const {
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      at,
      ct,
      mt,
      pt,
    } = dynamicLinkInfo

    if (utmSource !== undefined)
      result.googlePlayAnalytics.utmSource = utmSource
    if (utmMedium !== undefined)
      result.googlePlayAnalytics.utmMedium = utmMedium
    if (utmCampaign !== undefined)
      result.googlePlayAnalytics.utmCampaign = utmCampaign
    if (utmTerm !== undefined) result.googlePlayAnalytics.utmTerm = utmTerm
    if (utmContent !== undefined)
      result.googlePlayAnalytics.utmTerm = utmContent

    if (at !== undefined) result.itunesConnectAnalytics.at = at
    if (ct !== undefined) result.itunesConnectAnalytics.ct = ct
    if (mt !== undefined) result.itunesConnectAnalytics.mt = mt
    if (pt !== undefined) result.itunesConnectAnalytics.pt = pt

    return Object.keys(result).length === 0 ? undefined : result
  }

  private static getSocialMetaTagInfo(
    dynamicLinkInfo: IDynamicLinkInfo,
  ): SocialMetaTagInfoResponse {
    const result = new SocialMetaTagInfoResponse()

    const { socialTitle, socialDescription, socialImageLink } = dynamicLinkInfo

    if (socialTitle !== undefined) result.socialTitle = socialTitle
    if (socialDescription !== undefined)
      result.socialDescription = socialDescription
    if (socialImageLink !== undefined) result.socialImageLink = socialImageLink

    return Object.keys(result).length === 0 ? undefined : result
  }

  async generateDynamicLink(
    dynamicLinkInfo: IDynamicLinkInfo,
  ): Promise<DynamicLinkResponse> {
    const { suffix } = dynamicLinkInfo
    let { link } = dynamicLinkInfo
    if (!link.startsWith('http')) {
      link = this.configService.get('dynamic_link.bitcastle_url') + link
    }
    const bodyRequest = {
      dynamicLinkInfo: new DynamicLinkInfoBody(),
      suffix: {
        option:
          suffix === undefined ? SuffixOption.SHORT : SuffixOption[suffix],
      },
    }
    bodyRequest.dynamicLinkInfo.link = link
    const url = this.configService.get('dynamic_link.url')
    const apiKey = this.configService.get('dynamic_link.api_key')
    const postUrl = `${url}?key=${apiKey}`

    const domainUriPrefix = this.configService.get(
      'dynamic_link.domain_uri_prefix',
    )
    if (domainUriPrefix !== undefined)
      bodyRequest.dynamicLinkInfo.domainUriPrefix = domainUriPrefix

    const androidInfo = this.getAndroidInfo(dynamicLinkInfo)
    if (androidInfo !== undefined)
      bodyRequest.dynamicLinkInfo.androidInfo = androidInfo

    const iosInfo = this.getIosInfo(dynamicLinkInfo)
    if (iosInfo !== undefined) bodyRequest.dynamicLinkInfo.iosInfo = iosInfo

    const navigationInfo = DynamicLinkService.getNavigationInfo(dynamicLinkInfo)
    if (navigationInfo !== undefined)
      bodyRequest.dynamicLinkInfo.navigationInfo = navigationInfo

    const analyticsInfo = DynamicLinkService.getAnalyticsInfo(dynamicLinkInfo)
    if (analyticsInfo !== undefined)
      bodyRequest.dynamicLinkInfo.analyticsInfo = analyticsInfo

    const socialMetaTagInfo =
      DynamicLinkService.getSocialMetaTagInfo(dynamicLinkInfo)
    if (socialMetaTagInfo !== undefined)
      bodyRequest.dynamicLinkInfo.socialMetaTagInfo = socialMetaTagInfo

    try {
      const result = await firstValueFrom(
        await this.httpService
          .post(postUrl, JSON.stringify(classToPlain(bodyRequest)), {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .pipe(map((response) => response.data)),
      )
      return {
        result: true,
        warning: result.warning ? result.warning : undefined,
        data: {
          shortLink: result.shortLink,
          previewLink: result.previewLink,
        },
      }
    } catch (e) {
      const error = e.response?.data?.error
      this.logger.error(e, e.stack)
      this.logger.error(error)
      return {
        result: false,
        error: {
          code: error?.code,
          status: error?.status,
          message: error?.message,
        },
      }
    }
  }
}
