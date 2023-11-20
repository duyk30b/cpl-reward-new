import { Controller, Get, Query } from '@nestjs/common'
import { ApiQuery } from '@nestjs/swagger'
import { GetRewardEarnedFilterDto } from './api-internal.dto'
import { ApiInternalService } from './api-internal.service'

@Controller()
export class ApiInternalController {
  constructor(private readonly apiInternalService: ApiInternalService) {}

  @Get('total-reward-earned')
  @ApiQuery({
    name: 'currency',
    required: false,
  })
  async getTotalRewardEarned(
    @Query() filter: GetRewardEarnedFilterDto,
    @Query('currency') currency: string,
  ) {
    return await this.apiInternalService.getTotalRewardEarned(filter, currency)
  }

  @Get('list-reward-earned')
  async getListRewardEarned(@Query() filter: GetRewardEarnedFilterDto) {
    return await this.apiInternalService.getListRewardEarned(filter)
  }
}
