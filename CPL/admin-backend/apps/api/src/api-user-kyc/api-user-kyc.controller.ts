import {
  Body,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common'
import { Controller, Get } from '@nestjs/common'
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger'
import { IRequestWithAccessToken } from '../interfaces/request-with-access-token'
import { Permission } from '../permissions/permission.data'
import { CheckPermission } from '../permissions/permission.decorator'
import {
  CheckDuplicateIdDocumentNoDto,
  FindRekognitionInfoHistoryWithUserInfoDto,
  FindRelatedFaceDto,
  ReviewOcrDto,
  ReviewRiskDto,
} from './api-user-kyc.dto'
import { ApiUserKycService } from './api-user-kyc.service'

@ApiTags('user-kyc')
@Controller('user-kyc')
export class ApiUserKycController {
  constructor(private readonly apiUserKycService: ApiUserKycService) {}

  @Get('detail')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_KYC_READ)
  @ApiQuery({ name: 'user_id', required: true })
  async findKycByUserId(@Query('user_id') userId: string) {
    return await this.apiUserKycService.findKycByUserId(userId)
  }

  @Get('enterprise-info')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_KYC_READ_ENTERPRISE_INFO)
  @ApiQuery({ name: 'user_id', required: true })
  async findEnterpriseInfoByUserId(@Query('user_id') userId: string) {
    return await this.apiUserKycService.findEnterpriseInfoByUserId(userId)
  }

  @Get('cynopsis')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_KYC_READ_SCAN_DATA)
  @ApiQuery({ name: 'user_kyc_history_id', required: true })
  async findCynopsisByKycHistoryId(
    @Query('user_kyc_history_id') userKycHistoryId: string,
  ) {
    return await this.apiUserKycService.findCynopsisByKycHistoryId(
      userKycHistoryId,
    )
  }

  @Post('/review-ocr')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_KYC_REVIEW)
  @HttpCode(HttpStatus.OK)
  async reviewOcr(
    @Body() reviewOcrDto: ReviewOcrDto,
    @Req() req: IRequestWithAccessToken,
  ) {
    return await this.apiUserKycService.reviewOcr(
      reviewOcrDto,
      req.accessTokenInfo.uid,
    )
  }

  @Post('/review-risk')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_KYC_REVIEW)
  @HttpCode(HttpStatus.OK)
  async reviewRisk(
    @Body() reviewRiskDto: ReviewRiskDto,
    @Req() req: IRequestWithAccessToken,
  ) {
    return await this.apiUserKycService.reviewRisk(
      reviewRiskDto,
      req.accessTokenInfo.uid,
    )
  }

  @Post('/check-duplicate-id-document-no')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_KYC_READ)
  @HttpCode(HttpStatus.OK)
  async checkDuplicateIdDocumentNo(
    @Body() checkDuplicateIdDocumentNoDto: CheckDuplicateIdDocumentNoDto,
  ) {
    return await this.apiUserKycService.checkDuplicateIdDocumentNo(
      checkDuplicateIdDocumentNoDto,
    )
  }

  @Post('/renew-cynopsis-data')
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'user_kyc_history_id', required: true })
  @CheckPermission(Permission.USER_KYC_RENEW_SCAN_DATA)
  @HttpCode(HttpStatus.OK)
  async renewCynopsisData(
    @Query('user_kyc_history_id') userKycHistoryId: string,
  ) {
    return await this.apiUserKycService.renewCynopsisData(userKycHistoryId)
  }

  @Get('admin-decision')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_KYC_READ_ADMIN_DECISIONS)
  @ApiQuery({ name: 'user_id', required: true })
  async findAdminDecisionByUserId(@Query('user_id') userId: string) {
    return await this.apiUserKycService.findAdminDecisionByUserId(userId)
  }

  @Get('image-process-results')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_KYC_READ_SCAN_DATA)
  @ApiQuery({ name: 'user_kyc_history_id', required: true })
  async getImageProcessResultsByKycHistoryId(
    @Query('user_kyc_history_id') userKycHistoryId: string,
  ) {
    return await this.apiUserKycService.getImageProcessResultsByKycHistoryId(
      userKycHistoryId,
    )
  }

  @Get('amazon-rekognition')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_KYC_READ_SCAN_DATA)
  @ApiQuery({ name: 'user_kyc_history_id', required: true })
  async findRekognitionInfoHistoryByKycHistoryId(
    @Query('user_kyc_history_id') userKycHistoryId: string,
  ) {
    return await this.apiUserKycService.findRekognitionInfoHistoryByKycHistoryId(
      userKycHistoryId,
    )
  }

  @Get('amazon-rekognition/related-faces')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_KYC_READ_SCAN_DATA)
  async findRelatedFaces(@Query() filter: FindRelatedFaceDto) {
    return await this.apiUserKycService.findRelatedFaces(filter)
  }

  @Get('amazon-rekognition/related-users')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_KYC_READ_SCAN_DATA)
  async findRekognitionInfoHistoryWithUserInfo(
    @Query() filter: FindRekognitionInfoHistoryWithUserInfoDto,
  ) {
    return await this.apiUserKycService.findRekognitionInfoHistoryWithUserInfo(
      filter,
    )
  }

  @Get('amazon-rekognition/:rekognition_info_history_id/detail')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_KYC_READ_SCAN_DATA)
  async findRekognitionInfoHistoryDetail(
    @Param('rekognition_info_history_id') rekognitionInfoHistoryId: string,
  ) {
    return await this.apiUserKycService.findRekognitionInfoHistoryDetail(
      rekognitionInfoHistoryId,
    )
  }

  @Get('sumsub-filemap')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_KYC_READ_SCAN_DATA)
  @ApiQuery({ name: 'user_kyc_history_id', required: true })
  async getSumsubFileMapByKycHistoryId(
    @Query('user_kyc_history_id') userKycHistoryId: string,
  ) {
    return await this.apiUserKycService.getSumsubFileMapByKycHistoryId(
      userKycHistoryId,
    )
  }

  @Get('sumsub-detail')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_KYC_READ_SCAN_DATA)
  @ApiQuery({ name: 'user_kyc_history_id', required: true })
  async getSumsubDetailByKycHistoryId(
    @Query('user_kyc_history_id') userKycHistoryId: string,
  ) {
    return await this.apiUserKycService.getSumsubDetailByKycHistoryId(
      userKycHistoryId,
    )
  }
}
