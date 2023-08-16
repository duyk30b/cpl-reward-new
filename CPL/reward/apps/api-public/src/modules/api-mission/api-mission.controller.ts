import { Controller, Get, Param, Post, Query } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { UserId } from '../../decorators/request.decorator'
import { ApiMissionService } from './api-mission.service'
import { PaginationMissionRequest } from './request/pagination-mission.request'
import { PaginationRewardHistoryRequest } from './request/pagination-reward-history.request'
import {
  AffiliateEarnedShortSwaggerResponse,
  RedeemMissionResponse,
  UnauthorizedSwagger,
} from './swagger/response.swagger'

@ApiTags('Missions')
@ApiBearerAuth('access-token')
@ApiExtraModels(PaginationMissionRequest)
@Controller('missions')
export class ApiMissionController {
  constructor(private readonly apiMissionService: ApiMissionService) {}

  @Get()
  @ApiOperation({ summary: 'Get mission list' })
  @ApiUnauthorizedResponse(UnauthorizedSwagger)
  async paginationMission(@Query() request: PaginationMissionRequest, @UserId() userId: string) {
    return await this.apiMissionService.paginationMission(request, userId)
  }

  @Get('affiliate-earned-short')
  @ApiOperation({ summary: 'Get money earned by affiliate program (return total money)' })
  @ApiUnauthorizedResponse(UnauthorizedSwagger)
  @ApiOkResponse(AffiliateEarnedShortSwaggerResponse)
  async getAffiliateEarned(@UserId() userId: string) {
    return await this.apiMissionService.getAffiliateEarned(userId)
  }

  @Get('affiliate-earned-detail')
  @ApiOperation({ summary: 'Get money earned by affiliate program (return detail list)' })
  @ApiUnauthorizedResponse(UnauthorizedSwagger)
  async getAffiliateHistoryDetail(
    @Query() request: PaginationRewardHistoryRequest,
    @UserId() userId: string,
  ) {
    return await this.apiMissionService.getAffiliateHistoryDetail(request, userId)
  }

  @Post(':id/redeem')
  @ApiOperation({ summary: 'Request to redeem mission' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiUnauthorizedResponse(UnauthorizedSwagger)
  @ApiOkResponse(RedeemMissionResponse)
  async redeem(@Param('id') id: number, @UserId() userId: string) {
    const success = await this.apiMissionService.requestRedeemMission(id, userId)
    return { success }
  }
}
