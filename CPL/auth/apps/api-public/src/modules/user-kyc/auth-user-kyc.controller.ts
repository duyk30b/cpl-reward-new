import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { ApiCommon } from '../../api-docs/common-headers'
import { PersonalUserKycDto } from './dto/personal-user-kyc.dto'
import { AuthUserKycService } from './auth-user-kyc.service'
import { IRequestWithAccessToken } from '../../interfaces/request-with-access-token'
import { FileInterceptor } from '@nestjs/platform-express'
import { EnterpriseUserKycDto } from './dto/enterprise-user-kyc.dto'
import { UploadKycFileBodyDto } from './dto/upload-kyc-file.dto'
import { CheckDuplicateIdDocumentNoDto } from './dto/check-duplicate-id-document-no.dto'
import {
  InfoNotFoundResponse,
  KycCaptchaResponse,
} from './auth-user-kyc.constant'

@ApiHeader(ApiCommon.device)
@ApiTags('user-kyc')
@Controller('user-kyc')
export class AuthUserKycController {
  constructor(private readonly authUserKycService: AuthUserKycService) {}

  @Get('get-captcha')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get captcha when user submit kyc photo' })
  @ApiBadRequestResponse(InfoNotFoundResponse)
  @ApiOkResponse(KycCaptchaResponse)
  async getCaptcha(@Req() request: IRequestWithAccessToken) {
    const { userId } = request.accessTokenInfo
    return this.authUserKycService.getCaptchaInKyc(userId)
  }

  @Post('upload-file')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Upload file for kyc' })
  @ApiConsumes('multipart/form-data')
  @ApiHeader(ApiCommon.recaptcha)
  @ApiHeader(ApiCommon.recaptcha_type)
  @ApiBody({ type: UploadKycFileBodyDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Upload file successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request body is invalid.',
  })
  async uploadKycFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadKycFileBodyDto: UploadKycFileBodyDto,
    @Req() request: IRequestWithAccessToken,
  ) {
    const { id } = await this.authUserKycService.uploadKycFile(
      request.accessTokenInfo.userId,
      uploadKycFileBodyDto,
      file,
    )
    return { id }
  }

  @Post('register-personal')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Register personal user kyc' })
  @ApiBody({ type: PersonalUserKycDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Register successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request body is invalid.',
  })
  async registerPersonalKyc(
    @Body() authUserKycDto: PersonalUserKycDto,
    @Req() request: IRequestWithAccessToken,
  ) {
    await this.authUserKycService.registerPersonalKyc(
      request.accessTokenInfo.userId,
      authUserKycDto,
    )
    return { success: true }
  }

  @Post('register-enterprise')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Register enterprise user kyc' })
  @ApiBody({ type: EnterpriseUserKycDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Register successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request body is invalid.',
  })
  async registerEnterpriseKyc(
    @Body() authUserKycDto: EnterpriseUserKycDto,
    @Req() request: IRequestWithAccessToken,
  ) {
    await this.authUserKycService.registerEnterpriseKyc(
      request.accessTokenInfo.userId,
      authUserKycDto,
    )
    return { success: true }
  }

  // TODO: Xóa API này khi các team confirm API libzoom hoàn thành
  @Get('liveness-token')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get token to support liveness' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get token successfully',
  })
  async getLivenessToken() {
    return await this.authUserKycService.getLivenessToken()
  }

  @Get('liveness-lib-zoom-token')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get token to support liveness lib zoom' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get token successfully',
  })
  async getLivenessLibZoomToken() {
    return await this.authUserKycService.getLivenessLibZoomToken()
  }

  @Get('ocr-info')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get ocr info from image id' })
  @ApiQuery({ name: 'file_id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get info successfully',
  })
  async getOcrInfo(
    @Query('file_id') fileId: string,
    @Req() request: IRequestWithAccessToken,
  ) {
    return await this.authUserKycService.getOcrInfo(
      fileId,
      request.accessTokenInfo.userId,
    )
  }

  @Post('/check-duplicate-id-document-no')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Check if id document number existed' })
  @ApiBody({ type: CheckDuplicateIdDocumentNoDto })
  async checkDuplicateIdDocumentNo(
    @Body() checkDuplicateIdDocumentNoDto: CheckDuplicateIdDocumentNoDto,
    @Req() request: IRequestWithAccessToken,
  ) {
    const exist = await this.authUserKycService.checkDuplicateIdDocumentNo(
      checkDuplicateIdDocumentNoDto,
      request.accessTokenInfo.userId,
    )
    return { valid: !exist }
  }

  @Get('detail')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get user kyc detail info' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get info successfully',
  })
  async getKycDetail(@Req() request: IRequestWithAccessToken) {
    return await this.authUserKycService.getKycDetail(
      request.accessTokenInfo.userId,
    )
  }
}
