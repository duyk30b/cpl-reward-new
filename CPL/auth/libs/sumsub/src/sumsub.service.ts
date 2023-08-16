import { HttpService } from '@nestjs/axios'
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { lastValueFrom } from 'rxjs'
import { createHmac } from 'crypto'
import { AxiosRequestConfig } from '@nestjs/terminus/dist/health-indicator/http/axios.interfaces'
import {
  ISumsubApplicant,
  ISumsubApplicantStatus,
  ISumsubInspectionResponse,
  ISumsubSimilarApplicant,
  ISumsubSimilarApplicantsResponse,
  SumsubApplicantDocsStatus,
  SumsubCheckType,
} from './sumsub.type'
import { getBufferFromUrl } from '@lib/util'
import { UploadFileService } from '@lib/upload-file'
import { ISumsubFileMap } from '@lib/user-kyc-sumsub/user-kyc-sumsub.type'

const SEPARATOR = '___'

@Injectable()
export class SumsubService {
  private readonly logger = new Logger(SumsubService.name)
  private readonly sumsubAppToken: string
  private readonly sumsubBaseUrl: string
  private readonly sumsubTokenTtl: number
  private readonly sumsubLevelName: string
  private readonly sumsubSecretKey: string

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly uploadFileService: UploadFileService,
  ) {
    this.sumsubAppToken = this.configService.get('sumsub.app_token')
    this.sumsubBaseUrl = this.configService.get('sumsub.base_url')
    this.sumsubTokenTtl = this.configService.get('sumsub.token_ttl')
    this.sumsubLevelName = this.configService.get('sumsub.level_name')
    this.sumsubSecretKey = this.configService.get('sumsub.secret_key')
  }

  async createToken(userId: string) {
    const externalUserId = this.generateExternalUserId(userId)
    const url = `/resources/accessTokens?userId=${externalUserId}&ttlInSecs=${this.sumsubTokenTtl}&levelName=${this.sumsubLevelName}`

    try {
      const config: AxiosRequestConfig = {
        baseURL: this.sumsubBaseUrl,
        url: url,
        method: 'post',
        data: null,
      }
      config.headers = this.buildHeaders(config)
      const response = await lastValueFrom(
        await this.httpService.post(url, null, config),
      )
      return response.data
    } catch (e) {
      this.logger.error(e, e.stack, 'createToken')
      throw new InternalServerErrorException()
    }
  }

  async getApplicantData(userId: string): Promise<ISumsubApplicant> {
    const externalUserId = this.generateExternalUserId(userId)
    const url = `/resources/applicants/-;externalUserId=${externalUserId}/one`

    try {
      const config: AxiosRequestConfig = {
        baseURL: this.sumsubBaseUrl,
        url: url,
        method: 'GET',
      }
      config.headers = this.buildHeaders(config)
      const response = await lastValueFrom(
        await this.httpService.get(url, config),
      )
      return response.data
    } catch (e) {
      this.logger.warn(e)
      this.logger.warn(e.stack, 'getApplicantData')
    }
  }

  async getApplicantDocsStatus(
    applicantId: string,
  ): Promise<SumsubApplicantDocsStatus> {
    const url = `/resources/applicants/${applicantId}/requiredIdDocsStatus`

    try {
      const config: AxiosRequestConfig = {
        baseURL: this.sumsubBaseUrl,
        url: url,
        method: 'GET',
      }
      config.headers = this.buildHeaders(config)
      const response = await lastValueFrom(
        await this.httpService.get(url, config),
      )
      return response.data
    } catch (e) {
      this.logger.error(e, e.stack, 'getApplicantDocsStatus')
    }
  }

  async getApplicantStatus(
    applicantId: string,
  ): Promise<ISumsubApplicantStatus> {
    const url = `/resources/applicants/${applicantId}/status`

    try {
      const config: AxiosRequestConfig = {
        baseURL: this.sumsubBaseUrl,
        url: url,
        method: 'GET',
      }
      config.headers = this.buildHeaders(config)
      const response = await lastValueFrom(
        await this.httpService.get(url, config),
      )
      return response.data
    } catch (e) {
      this.logger.error(e, e.stack, 'getApplicantStatus')
    }
  }

  async getSimilarApplicants(
    applicantId: string,
  ): Promise<ISumsubSimilarApplicantsResponse> {
    const url = `/resources/applicants/${applicantId}/similarApplicants?onlyByText=false`

    try {
      const config: AxiosRequestConfig = {
        baseURL: this.sumsubBaseUrl,
        url: url,
        method: 'GET',
      }
      config.headers = this.buildHeaders(config)
      const response = await lastValueFrom(
        await this.httpService.get(url, config),
      )
      return response.data
    } catch (e) {
      this.logger.error(e, e.stack, 'getSimilarApplicants')
    }
  }

  async getUserInspection(
    inspectionId: string,
  ): Promise<ISumsubInspectionResponse> {
    const url = `/resources/inspections/${inspectionId}`
    try {
      const config: AxiosRequestConfig = {
        baseURL: this.sumsubBaseUrl,
        url: url,
        method: 'GET',
      }
      config.headers = this.buildHeaders(config)
      const response = await lastValueFrom(
        await this.httpService.get(url, config),
      )
      return response.data
    } catch (e) {
      this.logger.error(e, e.stack, 'getUserInspection')
    }
  }

  async deleteApplicant(applicantId: string): Promise<ISumsubApplicant> {
    const url = `/resources/applicants`
    try {
      const data = { id: applicantId, deleted: true }
      const config: AxiosRequestConfig = {
        baseURL: this.sumsubBaseUrl,
        url: url,
        method: 'PATCH',
        data: JSON.stringify(data),
      }
      config.headers = this.buildHeaders(config)
      const response = await lastValueFrom(
        await this.httpService.patch(url, data, config),
      )
      return response.data
    } catch (e) {
      this.logger.error(e, e.stack, 'deleteApplicant')
    }
  }

  async resetApplicant(applicantId: string) {
    const url = `/resources/applicants/${applicantId}/reset`
    try {
      const data = {}
      const config: AxiosRequestConfig = {
        baseURL: this.sumsubBaseUrl,
        url: url,
        method: 'POST',
        data: JSON.stringify(data),
      }
      config.headers = this.buildHeaders(config)
      const response = await lastValueFrom(
        await this.httpService.post(url, data, config),
      )
      return response.data
    } catch (e) {
      this.logger.error(e, e.stack, 'resetApplicant')
    }
  }

  async getImage(inspectionId: string, imageId: string) {
    const url = `/resources/inspections/${inspectionId}/resources/${imageId}`
    try {
      const config: AxiosRequestConfig = {
        url: url,
        method: 'GET',
      }
      const headers = this.buildHeaders(config)
      const buffer: Buffer = await getBufferFromUrl(
        `${this.sumsubBaseUrl}${url}`,
        { headers },
      )
      return buffer
    } catch (e) {
      this.logger.error(e, e.stack, 'getImage')
    }
  }

  private buildHeaders(config: AxiosRequestConfig) {
    const headers = config.headers || {}
    headers['Accept'] = 'application/json'
    headers['X-App-Token'] = this.sumsubAppToken

    const ts = Math.floor(Date.now() / 1000)
    const signature = createHmac('sha256', this.sumsubSecretKey)
    signature.update(ts + config.method.toUpperCase() + config.url)

    if (config.data) {
      signature.update(config.data)
    }
    headers['X-App-Access-Ts'] = ts
    headers['X-App-Access-Sig'] = signature.digest('hex')

    return headers
  }

  generateExternalUserId(userId: string) {
    return `${this.configService.get('env')}${SEPARATOR}${userId}`
  }

  getUserIdFromExternalUserId(externalUserId: string) {
    const [env, userId] = externalUserId.split(SEPARATOR)
    if (env != this.configService.get('env') || !userId) {
      throw new Error(`Invalid external user id: ${externalUserId}`)
    }
    return userId
  }

  getCurrentImagesAndChecks(inspection: ISumsubInspectionResponse) {
    const fromDate = inspection.inspectionResetDate || inspection.inspectionDate
    const fromTime = new Date(fromDate).getTime()
    inspection.images = inspection.images.filter(
      (image) =>
        !image.deleted && new Date(image.addedDate).getTime() >= fromTime,
    )
    inspection.checks = inspection.checks.filter(
      (check) => new Date(check.createdAt).getTime() >= fromTime,
    )
    return inspection
  }

  async uploadAllImagesFromSumsub(
    detail: {
      inspection: ISumsubInspectionResponse
      similarApplicants?: ISumsubSimilarApplicant[]
    },
    currentFileMap?: ISumsubFileMap,
  ) {
    const { inspection, similarApplicants } = detail
    const { images, checks } = inspection
    const imageIds = []

    currentFileMap = currentFileMap || {}

    images.forEach((image) => {
      if (!currentFileMap[image.imageId]) imageIds.push(image.imageId)
    })

    checks.forEach((check) => {
      const { checkType } = check

      if (checkType == SumsubCheckType.FACE_MATCH) {
        const { faceMatchInfo } = check
        if (!faceMatchInfo) return
        if (!currentFileMap[faceMatchInfo.faceContentId1]) {
          imageIds.push(faceMatchInfo.faceContentId1)
        }
        if (!currentFileMap[faceMatchInfo.faceContentId2]) {
          imageIds.push(faceMatchInfo.faceContentId2)
        }
      } else if (checkType == SumsubCheckType.FACE_LIVELINESS) {
        const { livenessInfo } = check
        if (!livenessInfo?.livenessData?.images) return
        livenessInfo.livenessData.images.forEach((image) => {
          if (!currentFileMap[image.imageId]) imageIds.push(image.imageId)
        })
      }
    })

    const promises = imageIds.map((imageId) =>
      this.uploadImageFromSumsub(inspection.id, imageId),
    )

    if (similarApplicants) {
      similarApplicants.forEach((e) => {
        const imageId = e.originalImageId
        if (imageId && !currentFileMap[imageId]) {
          promises.push(
            this.uploadImageFromSumsub(e.applicant.inspectionId, imageId),
          )
        }
      })
    }

    const result = await Promise.all(promises)
    const newFileMap = result.reduce((acc, cur) => ({ ...acc, ...cur }), {})
    return { ...currentFileMap, ...newFileMap }
  }

  private async uploadImageFromSumsub(
    inspectionId: string,
    imageId: string,
  ): Promise<ISumsubFileMap> {
    const buffer = await this.getImage(inspectionId, imageId)
    if (!buffer) return {}
    try {
      const file = await this.uploadFileService.uploadBuffer(
        buffer,
        `sumsub-${new Date().getTime()}-${inspectionId}-${imageId}`,
      )

      return {
        [imageId]: file,
      }
    } catch (e) {
      return {}
    }
  }
}
