import { Campaign } from '@lib/grpc-client/reward'
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { Permission } from '../permissions/permission.data'
import { CheckPermission } from '../permissions/permission.decorator'
import { ApiCampaignService } from './api-campaign.service'
import { ApiCreateCampaignDto } from './dto/api-create-campaign.dto'
import { ApiFindAllCampaignDto } from './dto/api-find-all-campaign.dto'
import { ApiUpdateCampaignDto } from './dto/api-update-campaign.dto'

@ApiTags('campaign')
@ApiBearerAuth('access-token')
@Controller('campaign')
export class ApiCampaignController {
  constructor(private readonly apiCampaignService: ApiCampaignService) {}

  @Get('/events')
  @CheckPermission(Permission.CAMPAIGN_GET_LIST_KAFKA_EVENTS)
  @ApiOperation({ summary: 'Get list of kafka event' })
  @ApiResponse({ status: HttpStatus.OK })
  getAllEvents() {
    return this.apiCampaignService.findAllEvents()
  }

  @Get('/grant-targets')
  @CheckPermission(Permission.CAMPAIGN_GET_LIST_GRANT_TARGETS)
  @ApiOperation({ summary: 'Get list of grant target' })
  @ApiResponse({ status: HttpStatus.OK })
  getGrantTargets() {
    return this.apiCampaignService.getGrantTargets()
  }

  @Get('/user-conditions')
  @CheckPermission(Permission.CAMPAIGN_GET_LIST_USER_CONDITIONS)
  @ApiOperation({ summary: 'Get list of user condition' })
  @ApiResponse({ status: HttpStatus.OK })
  getUserConditions() {
    return this.apiCampaignService.getUserConditions()
  }

  @Get('/display-conditions')
  @CheckPermission(Permission.CAMPAIGN_GET_DISPLAY_CONDITIONS)
  @ApiOperation({ summary: 'Get list of display condition' })
  @ApiResponse({ status: HttpStatus.OK })
  getDisplayConditions() {
    return this.apiCampaignService.getDisplayConditions()
  }

  @Post()
  @CheckPermission(Permission.CAMPAIGN_CREATE)
  async create(@Body() dto: ApiCreateCampaignDto): Promise<Campaign> {
    return await this.apiCampaignService.create(dto)
  }

  @Get()
  @CheckPermission(Permission.CAMPAIGN_GET_LIST)
  async pagination(@Query() campaignFilter: ApiFindAllCampaignDto) {
    return await this.apiCampaignService.pagination(campaignFilter)
  }

  @Get(':id')
  @ApiParam({ name: 'id', example: 1 })
  @CheckPermission(Permission.CAMPAIGN_READ)
  async findOne(@Param('id') id: string): Promise<Campaign> {
    return await this.apiCampaignService.findOne(+id)
  }

  @Patch(':id')
  @CheckPermission(Permission.CAMPAIGN_UPDATE)
  async update(@Param('id') id: number, @Body() dto: ApiUpdateCampaignDto) {
    return await this.apiCampaignService.update(id, dto)
  }

  @Delete(':id')
  @CheckPermission(Permission.CAMPAIGN_DELETE)
  remove(@Param('id') id: string) {
    return this.apiCampaignService.remove(+id)
  }
}
