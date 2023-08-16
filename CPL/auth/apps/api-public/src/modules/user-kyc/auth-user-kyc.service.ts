import { Injectable } from '@nestjs/common'
import {
  BusinessException,
  getBufferFromUrl,
  isImage,
  KycError,
  OcrError,
  UploadFileError,
  ValidationException,
} from '@lib/util'
import { FileService, UploadFileService } from '@lib/upload-file'
import {
  EnterpriseInfoHistoryService,
  EnterpriseInfoService,
  UserInfoHistoryService,
  UserInfoService,
  UserService,
} from '@lib/user'
import { UserKycHistoryService, UserKycService } from '@lib/user-kyc'
import {
  KycIdDocumentMetadata,
  KycIdDocumentType,
  KycImageProvider,
  KycStatus,
  KycType,
} from '@lib/user-kyc/enum/user-kyc.enum'
import { classToPlain, plainToClass } from 'class-transformer'
import { validate } from 'class-validator'
import { EnterpriseUserKycDto } from './dto/enterprise-user-kyc.dto'
import { PersonalUserKycDto } from './dto/personal-user-kyc.dto'
import { getKycFileDto, UploadKycFileBodyDto } from './dto/upload-kyc-file.dto'
import { UploadedFile } from '@lib/upload-file/entities/uploaded-file.entity'
import { UserInfoStatus, UserKycVerifyStatus } from '@lib/user/enum/user.enum'
import { ConfigService } from '@nestjs/config'
import { lastValueFrom, map } from 'rxjs'
import { HttpService } from '@nestjs/axios'
import { FlowService } from '@lib/flows'
import { FlowAction } from '@lib/flows/enum/flows.enum'
import { AresService } from '@lib/ares'
import { CheckDuplicateIdDocumentNoDto } from './dto/check-duplicate-id-document-no.dto'
import { UserInfo } from '@lib/user/entities/user-info.entity'
import {
  DOCUMENT_SIDE_METADATA_MAP,
  TWO_SIDE_DOCUMENT_TYPES,
} from '@lib/user/const/user-kyc.const'
import { UserKycCaptchaService } from '@lib/user-kyc/services/user-kyc-captcha.service'
import btoa = require('btoa')
import { KycCaptchaService } from '@lib/kyc-captcha'
import { AuthSettingService } from '@lib/auth-setting'
import { RedisQueueService } from '@lib/redis-queue'

@Injectable()
export class AuthUserKycService {
  constructor(
    private readonly userService: UserService,
    private readonly userKycService: UserKycService,
    private readonly userKycHistoryService: UserKycHistoryService,
    private readonly enterpriseInfoService: EnterpriseInfoService,
    private readonly enterpriseInfoHistoryService: EnterpriseInfoHistoryService,
    private readonly userInfoService: UserInfoService,
    private readonly uploadFileService: UploadFileService,
    private readonly fileService: FileService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly flowService: FlowService,
    private readonly aresService: AresService,
    private readonly userInfoHistoryService: UserInfoHistoryService,
    private readonly redisQueueService: RedisQueueService,
    private readonly userKycCaptchaService: UserKycCaptchaService,
    private readonly kycCaptchaService: KycCaptchaService,
    private readonly authSettingService: AuthSettingService,
  ) {}

  async getCaptchaInKyc(userId: string) {
    const existing = await this.userKycCaptchaService.getCaptchaByUserId(userId)
    if (existing) {
      const existingCaptcha = this.kycCaptchaService.createCaptcha(
        existing.captcha,
      )
      return {
        captcha: `data:image/svg+xml;base64,${btoa(existingCaptcha.data)}`,
      }
    }
    const captcha = this.kycCaptchaService.create({
      ignoreChars: 'abcdefghijklmnopqrstuvwxyz',
      size: 5,
    })
    await this.userKycCaptchaService.insertCaptcha(userId, captcha.text)
    return { captcha: `data:image/svg+xml;base64,${btoa(captcha.data)}` }
  }

  async uploadKycFile(
    userId: string,
    uploadKycFileBodyDto: UploadKycFileBodyDto,
    file: Express.Multer.File,
  ) {
    let metadata = uploadKycFileBodyDto.metadata
    if (
      uploadKycFileBodyDto.metadata == KycIdDocumentMetadata.SELFIE &&
      uploadKycFileBodyDto.faceRecognition == 1
    ) {
      metadata = KycIdDocumentMetadata.FACE_RECOGNITION
    }
    const typeOfDto = getKycFileDto(metadata)
    if (!typeOfDto) {
      throw new BusinessException(UploadFileError.METADATA_NOT_SUPPORTED)
    }
    const fileDto = plainToClass(typeOfDto, {
      file,
    })
    const errors = await validate(fileDto, {
      validationError: {
        target: false,
        value: false,
      },
    })
    if (errors.length) throw new ValidationException(errors)

    const uploadedFile = await this.uploadFileService.upload(file)

    return await this.fileService.create({
      ...uploadedFile,
      userId,
      metadata: metadata,
      isImage: isImage(file.mimetype),
    })
  }

  async registerPersonalKyc(
    userId: string,
    authUserKycDto: PersonalUserKycDto,
  ) {
    const { userInfo } = await this.checkUserKycCondition(userId, {
      ...authUserKycDto,
      type: KycType.PERSONAL,
    })

    this.validateIdDocumentType(userInfo, authUserKycDto.idDocumentType)

    const uploadedKycFiles = await this.getPersonalKycFiles(authUserKycDto)

    const kycSetting = await this.authSettingService.getKycSetting()

    const userKycDto = {
      userId: userId,
      files: uploadedKycFiles,
      type: KycType.PERSONAL,
      imageProvider: 0,
      riskScanProvider: 0,
      imageProviders: [KycImageProvider.AMAZON],
      riskScanProviders: kycSetting.personalRiskScanProviders,
      idDocumentType: authUserKycDto.idDocumentType,
      idDocumentNo: authUserKycDto.idDocumentNo || '',
      countryId: userInfo.countryId,
    }

    const history = await this.userKycHistoryService.saveUserKycHistory({
      ...userKycDto,
      userInfoHistoryId: userInfo.userInfoHistoryId,
      isModifiedByUser: true,
    })

    const userKyc = await this.userKycService.saveUserKyc({
      ...userKycDto,
      userKycHistoryId: history.id,
      status: KycStatus.NEW,
    })

    await this.userService.updateKycVerifyStatus(
      userId,
      UserKycVerifyStatus.PENDING,
    )
    await this.userService.updateLv(userId, 3, true)

    this.redisQueueService.addKycRegisteredJob(userId)

    await this.flowService.completeFlow(FlowAction.user_kyc, userId)

    return userKyc
  }

  async registerEnterpriseKyc(
    userId: string,
    authUserKycDto: EnterpriseUserKycDto,
  ) {
    const { userInfo } = await this.checkUserKycCondition(userId, {
      ...authUserKycDto,
      type: KycType.ENTERPRISE,
    })

    this.validateIdDocumentType(userInfo, authUserKycDto.idDocumentType)

    const uploadedKycFiles: UploadedFile[] = await this.getEnterpriseKycFiles(
      authUserKycDto,
    )

    const user = await this.userService.getUserById(userId)

    const enterpriseInfoHistory =
      await this.enterpriseInfoHistoryService.saveEnterpriseInfoHistory(
        userId,
        {
          ...authUserKycDto,
          userRelatedParties: classToPlain(authUserKycDto.userRelatedParties),
          loginEmail: user.email,
        },
      )

    await this.enterpriseInfoService.saveEnterpriseInfo(userId, {
      ...authUserKycDto,
      userRelatedParties: classToPlain(authUserKycDto.userRelatedParties),
      loginEmail: user.email,
    })

    const kycSetting = await this.authSettingService.getKycSetting()

    const userKycDto = {
      userId: userId,
      files: uploadedKycFiles,
      type: KycType.ENTERPRISE,
      imageProvider: 0,
      riskScanProvider: 0,
      imageProviders: kycSetting.enterpriseImageProviders,
      riskScanProviders: kycSetting.enterpriseRiskScanProviders,
      idDocumentType: authUserKycDto.idDocumentType,
      idDocumentNo: authUserKycDto.idDocumentNo || '',
      countryId: userInfo.countryId,
    }

    const history = await this.userKycHistoryService.saveUserKycHistory({
      ...userKycDto,
      userInfoHistoryId: userInfo.userInfoHistoryId,
      enterpriseInfoHistoryId: enterpriseInfoHistory.id,
      isModifiedByUser: true,
    })

    const userKyc = await this.userKycService.saveUserKyc({
      ...userKycDto,
      userKycHistoryId: history.id,
      status: KycStatus.NEW,
    })

    await this.userService.updateKycVerifyStatus(
      userId,
      UserKycVerifyStatus.PENDING,
    )
    await this.userService.updateLv(userId, 3, true)

    this.redisQueueService.addKycRegisteredJob(userId)

    await this.flowService.completeFlow(FlowAction.user_kyc, userId)

    return userKyc
  }

  private async checkUserKycCondition(
    userId: string,
    data: {
      idDocumentNo: string
      idDocumentType: number
      type: KycType
    },
  ) {
    const user = await this.userService.getUserById(userId)
    if (!user.email) {
      throw new BusinessException(KycError.USER_EMAIL_NOT_VERIFIED)
    }

    const { pending: userHavePendingKyc, userKyc } =
      await this.userKycService.checkUserHavePendingKyc(userId)
    if (userHavePendingKyc) {
      throw new BusinessException(KycError.HAVE_PENDING_KYC)
    }

    if (userKyc && userKyc.type != data.type) {
      throw new BusinessException(KycError.KYC_TYPE_CONFLICT)
    }

    if (user.userInfoStatus != UserInfoStatus.UPDATED) {
      throw new BusinessException(KycError.DOES_NOT_HAVE_INFO)
    }

    const userInfo = await this.userInfoService.getInfoByUserId(userId)
    if (!userInfo) {
      throw new BusinessException(KycError.DOES_NOT_HAVE_INFO)
    }

    const isDuplicateIdDocumentNo =
      await this.userKycService.checkDuplicateIdDocumentNo(
        data.idDocumentNo,
        data.idDocumentType,
        userInfo.countryId,
        userId,
      )

    if (isDuplicateIdDocumentNo) {
      throw new BusinessException(KycError.DUPLICATE_ID_DOCUMENT_NO)
    }

    return {
      user,
      userInfo,
      userKyc,
    }
  }

  private async getPersonalKycFiles(authUserKycDto: PersonalUserKycDto) {
    return await this.getCommonKycFiles(authUserKycDto)
  }

  private async getEnterpriseKycFiles(authUserKycDto: EnterpriseUserKycDto) {
    const uploadedKycFiles: UploadedFile[] = await this.getCommonKycFiles(
      authUserKycDto,
    )

    const certificateBusiness = await this.fileService.getUploadedFileById(
      authUserKycDto.certificateBusiness,
    )
    if (
      !certificateBusiness ||
      certificateBusiness.metadata != KycIdDocumentMetadata.CERTIFICATE_BUSINESS
    ) {
      throw new BusinessException(KycError.FILE_METADATA_NOT_MATCH)
    }
    uploadedKycFiles.push(certificateBusiness)

    const memorandumArticles = await this.fileService.getUploadedFileById(
      authUserKycDto.memorandumArticles,
    )
    if (
      !memorandumArticles ||
      memorandumArticles.metadata != KycIdDocumentMetadata.MEMORANDUM_ARTICLES
    ) {
      throw new BusinessException(KycError.FILE_METADATA_NOT_MATCH)
    }
    uploadedKycFiles.push(memorandumArticles)

    const officialCompanyReport = await this.fileService.getUploadedFileById(
      authUserKycDto.officialCompanyReport,
    )
    if (
      !officialCompanyReport ||
      officialCompanyReport.metadata !=
        KycIdDocumentMetadata.OFFICIAL_COMPANY_REPORT
    ) {
      throw new BusinessException(KycError.FILE_METADATA_NOT_MATCH)
    }
    uploadedKycFiles.push(officialCompanyReport)

    if (authUserKycDto.letterAuthoriration) {
      const letterAuthoriration = await this.fileService.getUploadedFileById(
        authUserKycDto.letterAuthoriration,
      )
      if (
        !letterAuthoriration ||
        letterAuthoriration.metadata !=
          KycIdDocumentMetadata.LETTER_AUTHORIZATION
      ) {
        throw new BusinessException(KycError.FILE_METADATA_NOT_MATCH)
      }
      uploadedKycFiles.push(letterAuthoriration)
    }

    if (authUserKycDto.supplementaryInformation) {
      const supplementaryInformation =
        await this.fileService.getUploadedFileById(
          authUserKycDto.supplementaryInformation,
        )
      if (
        !supplementaryInformation ||
        supplementaryInformation.metadata !=
          KycIdDocumentMetadata.SUPPLEMENTARY_INFORMATION
      ) {
        throw new BusinessException(KycError.FILE_METADATA_NOT_MATCH)
      }
      uploadedKycFiles.push(supplementaryInformation)
    }

    return uploadedKycFiles
  }

  private async getCommonKycFiles(
    authUserKycDto: PersonalUserKycDto | EnterpriseUserKycDto,
  ) {
    let uploadedKycFiles: UploadedFile[] = []
    const idDocumentType = authUserKycDto.idDocumentType

    const documentFront = await this.fileService.getUploadedFileById(
      authUserKycDto.documentFront,
    )
    if (
      !documentFront ||
      documentFront.metadata != DOCUMENT_SIDE_METADATA_MAP.FRONT[idDocumentType]
    ) {
      throw new BusinessException(KycError.FILE_METADATA_NOT_MATCH)
    }
    uploadedKycFiles.push(documentFront)

    if (TWO_SIDE_DOCUMENT_TYPES.some((type) => type == idDocumentType)) {
      const documentBack = await this.fileService.getUploadedFileById(
        authUserKycDto.documentBack,
      )
      if (
        !documentBack ||
        documentBack.metadata != DOCUMENT_SIDE_METADATA_MAP.BACK[idDocumentType]
      ) {
        throw new BusinessException(KycError.FILE_METADATA_NOT_MATCH)
      }
      uploadedKycFiles.push(documentBack)
    }

    const selfie = await this.fileService.getUploadedFileById(
      authUserKycDto.selfie,
    )
    if (
      !selfie ||
      (selfie.metadata != KycIdDocumentMetadata.SELFIE &&
        selfie.metadata != KycIdDocumentMetadata.FACE_RECOGNITION)
    ) {
      throw new BusinessException(KycError.FILE_METADATA_NOT_MATCH)
    }
    uploadedKycFiles.push(selfie)

    if (authUserKycDto.additionDocuments) {
      const additionDocuments = await this.fileService.getUploadedFilesByIds(
        authUserKycDto.additionDocuments,
      )
      uploadedKycFiles = uploadedKycFiles.concat(additionDocuments)
    }

    return uploadedKycFiles
  }

  async getLivenessLibZoomToken() {
    const livenessLibZoomUrl = this.configService.get('liveness.lib_zoom_url')
    const livenessToken = await this.getLivenessToken()
    if (!livenessToken || !livenessToken.access_token) {
      return null
    }
    const token = livenessToken.access_token
    try {
      const result = await this.httpService
        .get(livenessLibZoomUrl, {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        })
        .pipe(map((response) => response.data))
        .toPromise()

      if (result) {
        return result
      }
    } catch (e) {
      return null
    }

    return null
  }

  async getLivenessToken() {
    const livenessUrl = this.configService.get('liveness.url')
    const auth = Buffer.from(
      this.configService.get('liveness.client_id') +
        ':' +
        this.configService.get('liveness.secret'),
    ).toString('base64')

    try {
      const result = await lastValueFrom(
        this.httpService
          .post(
            livenessUrl,
            {},
            {
              headers: {
                authorization: 'Basic ' + auth,
                'content-type': 'application/x-www-form-urlencoded',
              },
            },
          )
          .pipe(map((response) => response.data)),
      )

      if (result) {
        return result
      }
    } catch (e) {
      return null
    }
  }

  async getOcrInfo(fileId: string, userId: string) {
    const file = await this.fileService.getUploadedFileById(fileId)
    if (!file || file.userId != userId) {
      throw new BusinessException(OcrError.INVALID_FILE)
    }
    const url = await this.uploadFileService.getPublicUrl(file.name)
    const buffer = await getBufferFromUrl(url)
    return await this.aresService.getOcrInfo(buffer)
  }

  async checkDuplicateIdDocumentNo(
    checkDuplicateIdDocumentNoDto: CheckDuplicateIdDocumentNoDto,
    userId: string,
  ) {
    const userInfo = await this.userInfoService.getInfoByUserId(userId)
    if (!userInfo) {
      throw new BusinessException(KycError.DOES_NOT_HAVE_INFO)
    }
    return await this.userKycService.checkDuplicateIdDocumentNo(
      checkDuplicateIdDocumentNoDto.idDocumentNo,
      checkDuplicateIdDocumentNoDto.idDocumentType,
      userInfo.countryId,
      userId,
    )
  }

  async getKycDetail(userId: string) {
    const userInfo = await this.userInfoService.getInfoByUserId(userId)
    const userKyc = await this.userKycService.getKycByUserId(userId)
    const enterpriseInfo =
      await this.enterpriseInfoService.getEnterpriseInfoByUserId(userId)

    const fileMap = {}
    if (userKyc) {
      const FILE_FIELD_MAP = {
        [KycIdDocumentMetadata.ID_CARD_FRONT]: 'document_front',
        [KycIdDocumentMetadata.ID_CARD_BACK]: 'document_back',
        [KycIdDocumentMetadata.PASSPORT]: 'document_front',
        [KycIdDocumentMetadata.DRIVING_LICENCE_FRONT]: 'document_front',
        [KycIdDocumentMetadata.DRIVING_LICENCE_BACK]: 'document_back',
        [KycIdDocumentMetadata.NUMBER_CARD_FRONT]: 'document_front',
        [KycIdDocumentMetadata.SELFIE]: 'selfie',
        [KycIdDocumentMetadata.FACE_RECOGNITION]: 'selfie',
        [KycIdDocumentMetadata.CERTIFICATE_BUSINESS]: 'certificate_business',
        [KycIdDocumentMetadata.MEMORANDUM_ARTICLES]: 'memorandum_articles',
        [KycIdDocumentMetadata.OFFICIAL_COMPANY_REPORT]:
          'official_company_report',
        [KycIdDocumentMetadata.LETTER_AUTHORIZATION]: 'letter_authoriration',
        [KycIdDocumentMetadata.SUPPLEMENTARY_INFORMATION]:
          'supplementary_information',
      }
      for (let i = 0; i < userKyc.files.length; i++) {
        const fileEntity = userKyc.files[i]
        const fileId = fileEntity['id']
        const fileName = fileEntity['name']
        const metadata = fileEntity['metadata']
        const file_mapped_field = FILE_FIELD_MAP[metadata]
        fileMap[fileId] = await this.uploadFileService.getPublicUrl(fileName)
        if (metadata == KycIdDocumentMetadata.ADDITION_DOCUMENTS) {
          userKyc['addition_documents'] = [
            ...(userKyc['addition_documents'] || []),
            fileId,
          ]
        } else if (file_mapped_field) {
          userKyc[file_mapped_field] = fileId
        }
      }
      delete userKyc.files
    }
    return {
      user_info: userInfo,
      user_kyc: userKyc,
      enterprise_info: enterpriseInfo,
      file_map: fileMap,
    }
  }

  private validateIdDocumentType(userInfo: UserInfo, idDocumentType) {
    const japan = this.configService.get('special_countries.japan')
    let validTypes = [KycIdDocumentType.ID_CARD, KycIdDocumentType.PASSPORT]
    if (userInfo.nationalityId == japan) {
      validTypes = [
        KycIdDocumentType.DRIVING_LICENCE,
        KycIdDocumentType.PASSPORT,
        KycIdDocumentType.NUMBER_CARD,
      ]
    }
    if (validTypes.every((type) => type != idDocumentType)) {
      throw new BusinessException(KycError.INVALID_DOCUMENT_TYPE)
    }
  }
}
