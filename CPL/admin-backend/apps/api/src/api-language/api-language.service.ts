import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import { IRequestWithAccessToken } from '../interfaces/request-with-access-token'
import { BusinessException, UploadFileError } from '@lib/util'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { LanguageSettingService } from '@lib/grpc-client/common-setting/language-setting/language-setting.service'
import {
  IGetLanguagesSettingDto,
  IGetTranslateSettingDto,
  LanguageSettingDto,
  TranslateAdminSettingDto,
  TranslatesAdminSettingDto,
} from '@lib/grpc-client/common-setting/language-setting/language-setting.dto'
import { getClientIp } from 'request-ip'
import { UploadFileService } from '@lib/upload-file'
import {
  ApiApplyAllDto,
  ApiPreviewTranslateDto,
} from './dto/api-preview-translate.dto'
import { ApiSetTranslateDto } from './dto/api-set-translate.dto'
import * as fastCsv from 'fast-csv'
import * as _ from 'lodash'
import { ApiSetLanguageDto } from './dto/api-set-language.dto'
import { objectFlip } from '@app/common'
import { QUEUE_IMPORT_TRANSLATES, QueueService } from '@lib/queue'

@Injectable()
export class ApiLanguageService {
  protected readonly logger = new Logger(ApiLanguageService.name)

  constructor(
    private readonly languageService: LanguageSettingService,
    private readonly eventEmitter: EventEmitter2,
    private readonly uploadFileService: UploadFileService,
    private readonly queueService: QueueService,
  ) {}

  async setLanguage(
    apiSetLanguageDto: ApiSetLanguageDto,
  ): Promise<LanguageSettingDto> {
    return await this.languageService.setLanguage({
      languageCode: apiSetLanguageDto.languageCode,
      name: apiSetLanguageDto.languageName,
      isActive:
        apiSetLanguageDto.isActive === undefined
          ? true
          : apiSetLanguageDto.isActive,
      icon: '',
      defaultLanguage: (apiSetLanguageDto.languageCode === 'en') as boolean,
    })
  }

  async setTranslate(
    apiSetTranslateDto: ApiSetTranslateDto,
  ): Promise<TranslateAdminSettingDto> {
    return await this.languageService.setTranslate({
      key: apiSetTranslateDto.key,
      translates: apiSetTranslateDto.translates,
    })
  }

  async setTranslates(
    data: TranslateAdminSettingDto[],
  ): Promise<TranslatesAdminSettingDto> {
    return await this.languageService.setTranslates(data)
  }

  async getTranslates(query: IGetTranslateSettingDto): Promise<any> {
    const result = await this.languageService.getTranslates(query)

    if (result.data === undefined) {
      return { pagination: result.pagination, data: [] }
    }

    const data = await this.mappingTranslates(result.data)
    return { pagination: result.pagination, data }
  }

  async importFile(
    file: Express.Multer.File,
    request: IRequestWithAccessToken,
  ): Promise<any> {
    if (file.mimetype !== 'text/csv') {
      throw new BusinessException(UploadFileError.WRONG_FILE_TYPE)
    }
    if (file.size === 0) {
      throw new BusinessException(UploadFileError.BLANK_FILE)
    }
    if (file.size > 1000000) {
      throw new BusinessException(UploadFileError.OVER_1MB)
    }

    await this.validateImportedTranslates(file.buffer.toString())

    const ip = getClientIp(request)
    const otherData = {
      ip,
      adminId: request.accessTokenInfo ? request.accessTokenInfo.uid : '0',
      userAgent: request.headers['user-agent'],
    }
    const uploaded = await this.uploadFileService.upload(
      file,
      'import_multi_language',
      otherData,
      file.originalname.split(' ').join('_'),
    )
    this.logger.log(
      `[IMPORT MULTI LANGUAGE] result uploaded: ${JSON.stringify({
        adminActionId: uploaded.adminActionId,
        adminId: uploaded.adminId,
      })}`,
    )

    return uploaded
  }

  async exportAll() {
    const result = await this.languageService.getAllAdminTranslates()
    const activeLanguages = await this.getLanguagesByType('active')
    const listKeyNameLanguageCode = await this.getKeyNameLanguageCode()

    const headers = ['Key']
    for (const language of activeLanguages) {
      headers.push(`${listKeyNameLanguageCode[language.languageCode]}`)
    }

    const exportData = []
    exportData.push(headers)
    const rows =
      result.data !== undefined && result.data.length > 0 ? result.data : []
    rows.map((row) => {
      const tempRow = [row.key]
      for (const language of activeLanguages) {
        let tempTrans = ''
        if (
          row.translates !== undefined &&
          row.translates[language.languageCode] !== undefined
        ) {
          tempTrans = row.translates[language.languageCode]
        }
        tempRow.push(tempTrans)
      }

      exportData.push(tempRow)
      return row
    })

    return fastCsv.writeToString(exportData)
  }

  private getHeaderPreviewFile(key: string, headers: string[]) {
    if (headers.length === 0) return [key]
    const output = [key]

    for (const header of headers) {
      output.push(header)
      output.push(`${header} Imported value`)
    }
    return output
  }

  private async getRowPreviewFile(
    data: Record<string, string>,
    headers: string[],
    key: string,
    oldData: Record<string, string>,
  ) {
    const listKeyNameLanguageCode = await this.getKeyNameLanguageCode()
    const listNameKeyLanguages = objectFlip(listKeyNameLanguageCode)
    const output = [data[key]]
    if (headers.length === 0) return output

    for (const header of headers) {
      if (_.isEmpty(oldData) || oldData[data[key]] === undefined) {
        output.push('')
        output.push(data[header])
      } else {
        output.push(oldData[data[key]][listNameKeyLanguages[header]])
        output.push(data[header])
      }
    }
    return output
  }

  async previewFile(apiPreviewTranslateDto: ApiPreviewTranslateDto) {
    const body = await this.uploadFileService.readBodyObjectData(
      apiPreviewTranslateDto.key,
    )

    const dataOutput = (await this.readCsvByStream(body)) as {
      headers: string[]
      content: Record<string, string>[]
    }
    const keys = _.map(dataOutput.content, 'Key')
    const result = await this.getOldAdminTranslates(keys)

    const key = dataOutput.headers.shift()
    const originalHeaders = dataOutput.headers
    const headers = this.getHeaderPreviewFile(key, originalHeaders)

    const exportData = []
    exportData.push(headers)

    for (const content of dataOutput.content) {
      const inputData = await this.getRowPreviewFile(
        content,
        originalHeaders,
        key,
        result,
      )
      exportData.push(inputData)
    }

    return fastCsv.writeToString(exportData)
  }

  async getAdminTranslateByKeys(keys: string[]) {
    if (keys.length === 0) return []
    const result = await this.languageService.getAdminTranslateByKeys({
      keys,
    })
    if (result.data === undefined || result.data.length === 0) return []

    return result.data
  }

  private async getOldAdminTranslates(keys: string[]) {
    const result = await this.languageService.getAdminTranslateByKeys({
      keys,
    })
    if (result.data === undefined || result.data.length === 0) return {}
    const output = {}
    result.data.map((translate) => {
      output[translate.key] = translate.translates
    })
    return output
  }

  private readCsvByStream(body) {
    return new Promise((resolve, reject) => {
      const content = []
      let headers = [] as string[]

      fastCsv
        .parseStream(body, {
          ignoreEmpty: true,
          headers: true,
          discardUnmappedColumns: true,
          trim: true,
          // renameHeaders: true,
        })
        .on('headers', (d) => {
          headers = d
        })
        .on('error', reject)
        .on('data', (row) => {
          content.push(row)
        })
        .on('end', () => {
          resolve({ headers, content })
        })
    }).catch((error) => {
      throw new InternalServerErrorException(error)
    })
  }

  private async validateImportedHeaders(
    headers = [] as string[],
    listKeyNameLanguageCode: Record<string, string>,
  ) {
    if (headers.length === 0) return true

    const languagesList = _.values(listKeyNameLanguageCode)
    for (const header of headers) {
      if (!languagesList.includes(header)) return false
    }
    return true
  }

  private async validateImportedTranslates(body) {
    const listKeyNameLanguageCode = await this.getKeyNameLanguageCode()
    return new Promise((resolve, reject) => {
      const data = []

      fastCsv
        .parseString(body, {
          ignoreEmpty: true,
          headers: true,
          discardUnmappedColumns: true,
          trim: true,
        })
        .on('headers', async (d) => {
          const headers = _.cloneDeep(d)
          const key = headers.shift()

          const validatedHeaders = await this.validateImportedHeaders(
            headers,
            listKeyNameLanguageCode,
          )

          if (key.trim() !== 'Key' || !validatedHeaders) {
            reject(UploadFileError.WRONG_HEADER.code)
          }
        })
        .on('error', reject)
        .on('data', (row) => {
          data.push(row)
        })
        .on('end', () => {
          if (data.length === 0) {
            reject(UploadFileError.BLANK_FILE.code)
          }
          resolve(data)
        })
    }).catch((error) => {
      if (error === UploadFileError.WRONG_HEADER.code) {
        throw new BusinessException(UploadFileError.WRONG_HEADER)
      }
      if (error === UploadFileError.BLANK_FILE.code) {
        throw new BusinessException(UploadFileError.BLANK_FILE)
      }
      throw new InternalServerErrorException(error)
    })
  }

  async applyAll(apiApplyAllDto: ApiApplyAllDto) {
    const body = await this.uploadFileService.readBodyObjectData(
      apiApplyAllDto.key,
    )

    const upsertData = []
    const dataOutput = (await this.readCsvByStream(body)) as {
      headers: string[]
      content: Record<string, string>[]
    }

    const key = dataOutput.headers.shift()
    const originalHeaders = dataOutput.headers
    const listKeyNameLanguageCode = await this.getKeyNameLanguageCode()
    const listNameKeyLanguages = objectFlip(listKeyNameLanguageCode)

    dataOutput.content.map((data) => {
      const tempData = { key: data[key], translates: {} }
      for (const header of originalHeaders) {
        tempData.translates[listNameKeyLanguages[header]] =
          data[header] === undefined ? '' : data[header]
      }
      upsertData.push(tempData)
      return data
    })

    if (upsertData.length > 0) {
      const chunkArray = _.chunk(upsertData, 300)
      for (const chunkArrayElement of chunkArray) {
        await this.queueService.addLanguageJob(
          QUEUE_IMPORT_TRANSLATES,
          {
            excelKey: apiApplyAllDto.key,
            upsertData: chunkArrayElement,
          },
          {
            removeOnComplete: true,
            removeOnFail: true,
          },
        )
      }
    }

    return upsertData
  }

  async getLanguagesSetting(query: IGetLanguagesSettingDto) {
    return await this.languageService.getLanguagesSetting(query)
  }

  async getLanguagesByType(type = '') {
    const result = await this.languageService.getLanguagesByType(type)
    return result.data === undefined ? [] : result.data
  }

  async getCodeLanguages(type = '') {
    const result = await this.languageService.getLanguagesByType(type)
    if (result.data === undefined) return []
    return result.data.map((item) => item.languageCode)
  }

  async getKeyNameLanguageCode() {
    const result = await this.languageService.getKeyNameLanguageCode()
    return result.data === undefined ? {} : result.data
  }

  async getPairCategoriesKey() {
    const result = await this.languageService.getPairCategoriesKey()
    if (result.data === undefined || result.data.length === 0) return []

    return this.mappingTranslates(result.data)
  }

  private async mappingTranslates(data: TranslateAdminSettingDto[]) {
    const activeLanguages = await this.getLanguagesByType('active')

    return data.map((data) => {
      const tempTranslate = {
        key: data.key,
      }
      for (const language of activeLanguages) {
        if (
          data.translates === undefined ||
          data.translates[language.languageCode] === undefined
        )
          continue
        tempTranslate[language.languageCode] =
          data.translates[language.languageCode]
      }
      return tempTranslate
    })
  }
}
