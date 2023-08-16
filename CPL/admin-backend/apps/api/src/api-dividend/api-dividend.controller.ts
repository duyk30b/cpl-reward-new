import {
  Controller,
  Get,
  Post,
  Put,
  Query,
  Param,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { DividendService } from './api-dividend.service'
import {
  GetDividendsListRequest,
  GetDividendCampaignNameRequest,
  GetDividendCodesRequest,
  GetUsersDisableDividendRequest,
  DividendAPIResponse,
  GetHistoriesRequest,
  ToggleDividendCodeDTO,
  CreateDividendCodeDTO,
  CreateDividendDTO,
  EditDividendDTO,
  ReviewCodeDTO,
} from './api-dividend.dto'
import { CheckPermission } from '../permissions/permission.decorator'
import { Permission } from '../permissions/permission.data'

@ApiTags('Dividend')
@Controller('dividend')
export class ApiDividendController {
  constructor(private readonly dividendService: DividendService) {}
  @Get('campaigns')
  @CheckPermission(Permission.DIVIDEND_GET_LIST)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get list dividend' })
  @ApiResponse({ type: DividendAPIResponse })
  @HttpCode(HttpStatus.OK)
  async getDividendsList(@Query() query: GetDividendsListRequest) {
    return await this.dividendService.getDividends(query)
  }

  @Get('campaigns/:id')
  @CheckPermission(Permission.DIVIDEND_GET_DETAIL)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get detail dividend' })
  @ApiResponse({ type: DividendAPIResponse })
  @HttpCode(HttpStatus.OK)
  async getDividendDetail(@Param('id') id: number) {
    return await this.dividendService.getDividendDetail(id)
  }

  @Get('campaigns/:id/statistics')
  @CheckPermission(Permission.DIVIDEND_GET_ADVANCED)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get dividend advanced' })
  @ApiResponse({ type: DividendAPIResponse })
  @HttpCode(HttpStatus.OK)
  async getDividendAdvanced(@Param('id') id: number) {
    return await this.dividendService.getDividendAdvanced(id)
  }

  @Post('campaigns')
  @CheckPermission(Permission.DIVIDEND_CREATED)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create dividend' })
  @ApiResponse({ type: DividendAPIResponse })
  @HttpCode(HttpStatus.CREATED)
  async createDividend(@Body() body: CreateDividendDTO) {
    return await this.dividendService.createDividend(body)
  }

  @Put('campaigns/update')
  @CheckPermission(Permission.DIVIDEND_UPDATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update dividend' })
  @ApiResponse({ type: DividendAPIResponse })
  @HttpCode(HttpStatus.OK)
  async editDividend(@Body() body: EditDividendDTO) {
    return await this.dividendService.editDividend(body)
  }

  @Post('campaigns/cancel')
  @CheckPermission(Permission.DIVIDEND_CANCEL)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Cancel dividend' })
  @ApiResponse({ type: DividendAPIResponse })
  @HttpCode(HttpStatus.OK)
  async cancelDividend(@Body('id') id: number) {
    return await this.dividendService.cancelDividend(id)
  }

  @Get('campaign-names')
  @CheckPermission(Permission.DIVIDEND_GET_CAMPAIGN_NAME)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get all dividend campaign name' })
  @ApiResponse({ type: DividendAPIResponse })
  @HttpCode(HttpStatus.OK)
  async getDividendCampaignName(
    @Query() query: GetDividendCampaignNameRequest,
  ) {
    return await this.dividendService.getDividendCampaignName(query)
  }

  @Get('campaign-names-advanced')
  @CheckPermission(Permission.DIVIDEND_GET_CAMPAIGN_NAME)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get all dividend campaign name advanced' })
  @ApiResponse({ type: DividendAPIResponse })
  @HttpCode(HttpStatus.OK)
  async getDividendCampaignNameAdvanced(
    @Query() query: GetDividendCampaignNameRequest,
  ) {
    return await this.dividendService.getDividendCampaignNameAdvanced(query)
  }

  @Get('codes')
  @CheckPermission(Permission.DIVIDEND_GET_CODE_LIST)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get list code' })
  @ApiResponse({ type: DividendAPIResponse })
  @HttpCode(HttpStatus.OK)
  async getDividendCodes(@Query() query: GetDividendCodesRequest) {
    return await this.dividendService.getDividendCodes(query)
  }

  @Post('codes')
  @CheckPermission(Permission.DIVIDEND_CREATE_CODE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create dividend codes' })
  @ApiResponse({ type: DividendAPIResponse })
  @HttpCode(HttpStatus.OK)
  async createCodes(@Body() body: CreateDividendCodeDTO) {
    return await this.dividendService.createCodes(body)
  }

  @Post('codes/toggle-disability')
  @CheckPermission(Permission.DIVIDEND_TOOGLE_CODE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Enable/disable dividend code' })
  @ApiResponse({ type: DividendAPIResponse })
  @HttpCode(HttpStatus.OK)
  async toggleDividendCode(@Body() body: ToggleDividendCodeDTO) {
    return await this.dividendService.toggleDividendCode(body)
  }

  @Get('codes/review')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Review code' })
  @ApiResponse({ type: DividendAPIResponse })
  @HttpCode(HttpStatus.OK)
  async reviewCode(@Query() query: ReviewCodeDTO) {
    return this.dividendService.reviewCode(query)
  }

  @Post('codes/active')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Active code' })
  @ApiResponse({ type: DividendAPIResponse })
  @HttpCode(HttpStatus.OK)
  async activeCode(@Body() body: ReviewCodeDTO) {
    return this.dividendService.activeCode(body)
  }

  @Post('codes/delete')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete code' })
  @ApiResponse({ type: DividendAPIResponse })
  @HttpCode(HttpStatus.OK)
  async deleteCode(@Body('code') code: string) {
    return this.dividendService.deleteCode(code)
  }

  @Get('user-codes/:id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get list code of users' })
  @ApiResponse({ type: DividendAPIResponse })
  @HttpCode(HttpStatus.OK)
  async getCodesOfUser(@Param('id') id: number) {
    return this.dividendService.getCodesOfUser(id)
  }

  @Get('histories')
  @CheckPermission(Permission.DIVIDEND_GET_HISTORY)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get list of dividend history' })
  @ApiResponse({ type: DividendAPIResponse })
  @HttpCode(HttpStatus.OK)
  async getHistories(@Query() query: GetHistoriesRequest) {
    return await this.dividendService.getHistories(query)
  }

  @Get('disabled-users')
  @CheckPermission(Permission.DIVIDEND_GET_LIST_USER_DISABLE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get list of disabled users' })
  @ApiResponse({ type: DividendAPIResponse })
  @HttpCode(HttpStatus.OK)
  async getUsersDisableDividend(
    @Query() query: GetUsersDisableDividendRequest,
  ) {
    return await this.dividendService.getUsersDisableDividend(query)
  }

  @Post('disabled-users')
  @CheckPermission(Permission.DIVIDEND_DISABLE_USER)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Disable user' })
  @ApiResponse({ type: DividendAPIResponse })
  @HttpCode(HttpStatus.OK)
  async disableUserDividend(@Body('id') id: number) {
    return await this.dividendService.disableUserDividend(id)
  }

  @Post('disabled-users/delete')
  @CheckPermission(Permission.DIVIDEND_DELETE_DISABLE_USER)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete disabled user' })
  @ApiResponse({ type: DividendAPIResponse })
  @HttpCode(HttpStatus.OK)
  async deleteDisableUserDividend(@Body('id') id: number) {
    return await this.dividendService.deleteDisableUserDividend(id)
  }
}
