import { Controller, Get, HttpException, HttpStatus, Param, Post, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { UserId } from '../../decorators/request.decorator'
import { ApiCampaignService } from './api-campaign.service'
import { PaginationCampaignRequest } from './request/pagination-campaign.request'

@ApiTags('Campaigns')
@ApiBearerAuth('access-token')
@Controller('campaigns')
export class ApiCampaignController {
  constructor(private readonly apiCampaignService: ApiCampaignService) {}

  @Get()
  @ApiOperation({ summary: 'Get campaign list' })
  async paginationCampaignDefault(
    @Query() paginationCampaignRequest: PaginationCampaignRequest,
    @UserId() userId: string,
  ) {
    return await this.apiCampaignService.paginationCampaignDefault(
      paginationCampaignRequest,
      userId,
    )
  }

  @Get('/checkin')
  @ApiOperation({ summary: 'Get daily checkin campaign' })
  async getCheckInCampaign(@UserId() userId: string) {
    return await this.apiCampaignService.getCheckInCampaign(userId)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get campaign by ID' })
  async findOne(@Param('id') id: string) {
    return await this.apiCampaignService.findOneById(+id)
  }

  @Post('/checkin')
  @ApiOperation({ summary: 'Submit event checkin to claim daily checkin reward' })
  async claimCheckInReward(@UserId() userId: string) {
    const mission = await this.apiCampaignService.startCheckIn(userId)
    if (!mission) {
      throw new HttpException('REWARD.UNCLAIMABLE', HttpStatus.BAD_REQUEST)
    }
    return { mission }
  }

  @Post('/checkin-ignore')
  @ApiOperation({ summary: 'Ignore display checkin campaign popup' })
  async ignoreCheckInCampaignDisplay(@UserId() userId: string) {
    const result = await this.apiCampaignService.ignoreCheckInCampaignDisplay(userId)
    return { result }
  }
}
