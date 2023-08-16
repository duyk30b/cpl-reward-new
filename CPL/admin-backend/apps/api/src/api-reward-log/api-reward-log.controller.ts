import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Permission } from '../permissions/permission.data'
import { CheckPermission } from '../permissions/permission.decorator'
import {
  GetMissingRewardDto,
  InputUpdateRewardLogDto,
} from './api-reward-log.dto'
import { ApiRewardLogService } from './api-reward-log.service'

@Controller('reward-log')
@ApiTags('reward-log')
export class ApiRewardLogController {
  constructor(private readonly rewardLogService: ApiRewardLogService) {}

  @ApiOperation({
    summary: 'API get missing reward',
  })
  @Get('/missing')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.REWARD_LOG_GET_LIST)
  async getMissingRewards(@Query() query: GetMissingRewardDto) {
    return await this.rewardLogService.getMissingRewards(query)
  }

  @ApiOperation({
    summary: 'API count missing reward',
  })
  @Get('/missing-count')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.REWARD_LOG_COUNT)
  async countMissingReward() {
    return await this.rewardLogService.countMissingReward()
  }

  @ApiOperation({
    summary: 'API resolve missing reward',
  })
  @Patch('/:id(\\d+)/resolve')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.REWARD_LOG_RESOLVE)
  async resolveMissingReward(
    @Param('id') id: number,
    @Body() input: InputUpdateRewardLogDto,
  ) {
    return await this.rewardLogService.resolveMissingReward(id, input)
  }
}
