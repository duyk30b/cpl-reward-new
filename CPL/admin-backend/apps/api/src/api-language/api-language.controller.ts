import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
  Header,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { Permission } from '../permissions/permission.data'
import { CheckPermission } from '../permissions/permission.decorator'
import { FileInterceptor } from '@nestjs/platform-express'
import { IRequestWithAccessToken } from '../interfaces/request-with-access-token'
import { ApiLanguageService } from './api-language.service'
import {
  LanguagesByTypeResponse,
  ApiGetTranslatesResponse,
  IGetLanguagesSettingDto,
  IGetTranslateSettingDto,
  LanguageSettingDto,
  LanguagesSettingResponse,
  TranslateAdminSettingDto,
  CodeLanguagesResponse,
} from '@lib/grpc-client/common-setting/language-setting/language-setting.dto'
import { ImportTranslateResponse } from './api-language.interface'
import {
  ApiApplyAllDto,
  ApiPreviewTranslateDto,
} from './dto/api-preview-translate.dto'
import { Response as expressResponse } from 'express'
import { ApiSetTranslateDto } from './dto/api-set-translate.dto'
import { ApiBadRequestResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator'
import { IApiBadRequestResponse } from '@app/common/common.dto'
import { ApiGetTranslatesByKeysDto } from './dto/api-get-translates-by-keys.dto'
import { ApiSetLanguageDto } from './dto/api-set-language.dto'
import { instanceToPlain } from 'class-transformer'

@ApiTags('Language setting')
@Controller('api-language')
export class ApiLanguageController {
  constructor(private readonly apiLanguageService: ApiLanguageService) {}

  /**
   * Languages APIs
   */

  @Get('/get-languages-by-type')
  @CheckPermission(Permission.MULTI_LANGUAGE_SET_LANGUAGE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get languages by type' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: LanguagesByTypeResponse })
  public async getLanguagesByType(@Query() request: { type: string }) {
    return this.apiLanguageService.getLanguagesByType(request.type)
  }

  @Get('/code-languages')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get code languages' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: CodeLanguagesResponse })
  public async getCodeLanguages(@Query() request: { type: string }) {
    return this.apiLanguageService.getCodeLanguages(request.type)
  }

  @Post('/set-language')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.MULTI_LANGUAGE_SET_LANGUAGE)
  @ApiOperation({ summary: 'Set language setting' })
  @ApiOkResponse({ type: LanguageSettingDto })
  async setLanguage(
    @Body() apiSetLanguageDto: ApiSetLanguageDto,
  ): Promise<LanguageSettingDto> {
    return this.apiLanguageService.setLanguage(apiSetLanguageDto)
  }

  @Get('/list-language')
  @CheckPermission(Permission.MULTI_LANGUAGE_LIST_LANGUAGE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get list languages' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: LanguagesSettingResponse })
  public async getLanguages(@Query() query: IGetLanguagesSettingDto) {
    return this.apiLanguageService.getLanguagesSetting(query)
  }

  /**
   * END Languages APIs
   */

  /**
   * Translates APIs
   */

  @Post('/export-all')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.MULTI_LANGUAGE_EXPORT_ALL_TRANSLATE)
  @ApiCreatedResponse({ type: String })
  @ApiBadRequestResponse({ type: IApiBadRequestResponse })
  @Header('Content-Type', 'text/csv')
  async exportAll(@Res() response: expressResponse) {
    const csv = await this.apiLanguageService.exportAll()
    response.header('Content-Type', 'text/csv')
    response.send(csv)
  }

  @Post('/apply-all')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.MULTI_LANGUAGE_IMPORT_TRANSLATE)
  @ApiBody({ type: ApiApplyAllDto })
  @ApiCreatedResponse({ type: [TranslateAdminSettingDto] })
  @ApiBadRequestResponse({ type: IApiBadRequestResponse })
  async applyAll(@Body() apiApplyAllDto: ApiApplyAllDto) {
    return this.apiLanguageService.applyAll(apiApplyAllDto)
  }

  @Post('/preview-file')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.MULTI_LANGUAGE_IMPORT_TRANSLATE)
  @ApiBody({ type: ApiPreviewTranslateDto })
  @ApiCreatedResponse({ type: String })
  @ApiBadRequestResponse({ type: IApiBadRequestResponse })
  @Header('Content-Type', 'text/csv')
  async previewFile(
    @Body() apiPreviewTranslateDto: ApiPreviewTranslateDto,
    @Res() response: expressResponse,
  ) {
    const csv = await this.apiLanguageService.previewFile(
      apiPreviewTranslateDto,
    )
    response.header('Content-Type', 'text/csv')
    response.send(csv)
  }

  @Post('/import-file')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.MULTI_LANGUAGE_IMPORT_TRANSLATE)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiBadRequestResponse({ type: IApiBadRequestResponse })
  @ApiCreatedResponse({ type: ImportTranslateResponse })
  async importFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: IRequestWithAccessToken,
  ) {
    const result = await this.apiLanguageService.importFile(file, request)
    if (result.name === undefined) {
      return {
        key: '',
        admin_action_id: '',
      }
    }
    return {
      key: result.key,
      admin_action_id: result.adminActionId,
    }
  }

  @Post('/set-translate')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.MULTI_LANGUAGE_SET_TRANSLATE)
  @ApiOperation({ summary: 'Set translate' })
  @ApiOkResponse({ type: TranslateAdminSettingDto })
  async setTranslate(
    @Body() apiSetTranslateDto: ApiSetTranslateDto,
  ): Promise<TranslateAdminSettingDto> {
    return this.apiLanguageService.setTranslate(apiSetTranslateDto)
  }

  @Get('/list-translates')
  @CheckPermission(Permission.MULTI_LANGUAGE_GET_TRANSLATES)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get translates by pagination' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: ApiGetTranslatesResponse })
  public async getTranslates(@Query() query: IGetTranslateSettingDto) {
    return instanceToPlain(await this.apiLanguageService.getTranslates(query))
  }

  /**
   * END Translates APIs
   */

  /**
   * OTHER APIs Languages/Translates
   */

  @Post('/get-by-keys')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get translates by keys' })
  @ApiBadRequestResponse({ type: IApiBadRequestResponse })
  @ApiOkResponse({ type: [TranslateAdminSettingDto] })
  @HttpCode(HttpStatus.OK)
  async getTranslatesByKeys(
    @Body() apiGetTranslatesByKeysDto: ApiGetTranslatesByKeysDto,
  ): Promise<TranslateAdminSettingDto[]> {
    return this.apiLanguageService.getAdminTranslateByKeys(
      apiGetTranslatesByKeysDto.keys,
    )
  }

  @Get('/list-code-languages')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get list select code languages' })
  @HttpCode(HttpStatus.OK)
  async getListCodeLanguages(): Promise<Record<string, string>> {
    return this.apiLanguageService.getKeyNameLanguageCode()
  }

  @Get('/get-pair-categories-keys')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get list select code languages' })
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  async getPairCategoriesKey(): Promise<Record<string, string>[]> {
    return this.apiLanguageService.getPairCategoriesKey()
  }

  /**
   * END OTHER APIs Languages/Translates
   */
}
