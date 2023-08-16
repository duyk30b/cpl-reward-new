import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger'
import { Permission } from '../permissions/permission.data'
import { CheckPermission } from '../permissions/permission.decorator'
import {
  ChangeEmailDto,
  UserBanHistoryFilterDto,
  UserBlacklistHistoryFilterDto,
  UserFilterDto,
  UserFilterMarketingDto,
  UserSearchDto,
} from './api-user.dto'
import { ApiUserService } from './api-user.service'
import { IRequestWithAccessToken } from '../interfaces/request-with-access-token'
import { FileInterceptor } from '@nestjs/platform-express'
import { getClientIp } from 'request-ip'
import { IBanUser } from '@lib/grpc-client/user'

@ApiTags('user')
@Controller('user')
export class ApiUserController {
  constructor(private readonly apiUserService: ApiUserService) {}

  @Get()
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_GET_LIST)
  async getListUserForManagement(@Query() userFilterDto: UserFilterDto) {
    return await this.apiUserService.getListUserForManagement(userFilterDto)
  }

  @Get('/search')
  @ApiBearerAuth('access-token')
  async searchByFilter(@Query() query: UserSearchDto) {
    return this.apiUserService.searchByFilter(query)
  }

  @Get('marketing')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_MARKETING_GET_LIST)
  async getListUserForMarketing(
    @Query() userFilterMarketingDto: UserFilterMarketingDto,
  ) {
    return await this.apiUserService.getListUserForMarketing(
      userFilterMarketingDto,
    )
  }

  @Get('/marketing/export')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_MARKETING_EXPORT)
  async getUserTagExport() {
    return await this.apiUserService.getUserMarketingExport()
  }

  @Post('/marketing/export')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_MARKETING_EXPORT)
  async createUserTagExport(
    @Body() userFilterMarketingDto: UserFilterMarketingDto,
  ) {
    return await this.apiUserService.createUserMarketingExport(
      userFilterMarketingDto,
    )
  }

  @Get('/export')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_EXPORT)
  async getUsersExport() {
    return await this.apiUserService.getUsersExportInfo()
  }

  @Post('/export')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_EXPORT)
  async createUsersExport(@Body() userFilterDto: UserFilterDto) {
    return await this.apiUserService.createUsersExport(userFilterDto)
  }

  @Get('/ban-history')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.IMPORT_BAN_USER)
  async getListBanHistory(
    @Query() banHistoryFilterDto: UserBanHistoryFilterDto,
  ) {
    return await this.apiUserService.getListBanHistory(banHistoryFilterDto)
  }

  @Post('/ban-history/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.IMPORT_BAN_USER)
  async uploadFileBanHistory(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: IRequestWithAccessToken,
  ) {
    return await this.apiUserService.uploadBanUsersFile(file, request)
  }

  @Get('/blacklist-history')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.TOGGLE_BAN_USER)
  async getListBlacklistHistory(
    @Query() userBlacklistHistoryFilterDto: UserBlacklistHistoryFilterDto,
  ) {
    return await this.apiUserService.getUserBlacklistHistory(
      userBlacklistHistoryFilterDto,
    )
  }

  @Get('/:user_id')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_READ)
  @ApiParam({ name: 'user_id' })
  async getUser(@Param('user_id') userId: string) {
    return await this.apiUserService.getUser(userId)
  }

  @Post('/:user_id/ban')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.TOGGLE_BAN_USER)
  @ApiParam({ name: 'user_id' })
  async banUser(
    @Req() req: IRequestWithAccessToken,
    @Param('user_id') userId: string,
    @Body() data: IBanUser,
  ) {
    const banUserResult = await this.apiUserService.banUser(userId, data)

    if (!banUserResult.success) return banUserResult

    const requestLogInfo = {
      adminId: req.accessTokenInfo ? req.accessTokenInfo.uid : '0',
      userAgent: req.headers['user-agent'],
      ip: getClientIp(req),
    }
    await this.apiUserService.cancelWithdrawWhenBan(userId, requestLogInfo)
    await this.apiUserService.cancelOrderWhenBan(
      userId,
      req.accessTokenInfo.uid,
    )
    await this.apiUserService.rejectKycUser(userId, req.accessTokenInfo.uid)

    return banUserResult
  }

  @Post('/:user_id/unban')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.TOGGLE_BAN_USER)
  @ApiParam({ name: 'user_id' })
  async unbanUser(@Param('user_id') userId: string) {
    return await this.apiUserService.unbanUser(userId)
  }

  @Post('/:user_id/reset-authenticator')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_AUTHENTICATOR_RESET)
  @ApiParam({ name: 'user_id' })
  async resetAuthenticator(@Param('user_id') userId: string) {
    return await this.apiUserService.resetAuthenticator(userId)
  }

  @Post('/:user_id/change-email')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_CHANGE_EMAIL)
  @ApiParam({ name: 'user_id' })
  async changeEmail(
    @Param('user_id') userId: string,
    @Body() changeEmailDto: ChangeEmailDto,
  ) {
    return await this.apiUserService.changeEmail(
      userId,
      changeEmailDto.newEmail,
    )
  }
}
