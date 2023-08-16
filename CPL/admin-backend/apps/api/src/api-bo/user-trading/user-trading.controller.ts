import { Controller, Get, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Permission } from '../../permissions/permission.data'
import { CheckPermission } from '../../permissions/permission.decorator'
import {
  ListUserTradingDTO,
  RequestStatisticDetailDto,
  RequestStatisticSummaryDto,
  RequestStatisticUserDto,
  RequestSuspensionModesDto,
} from './user-trading.dto'
import { UserTradingService } from './user-trading.service'

@ApiTags('BO User Trading')
@Controller('bo')
export class UserTradingController {
  constructor(private readonly apiTradingService: UserTradingService) {}

  @Get('/user-tradings')
  @CheckPermission(Permission.HIGH_LOW_USER_TRADING_READ)
  @ApiBearerAuth('access-token')
  async list(@Query() listUserTradingDTO: ListUserTradingDTO) {
    return await this.apiTradingService.list(listUserTradingDTO)
  }

  @Get('/user-tradings/export')
  @CheckPermission(Permission.HIGH_LOW_USER_TRADING_READ)
  @ApiBearerAuth('access-token')
  async export(@Query() listUserTradingDTO: ListUserTradingDTO) {
    return await this.apiTradingService.export(listUserTradingDTO)
  }

  //Statistic
  @Get('/statistic/summary')
  @CheckPermission(Permission.HIGH_LOW_USER_TRADING_READ)
  @ApiBearerAuth('access-token')
  async statisticSummary(
    @Query() requestStatisticSummaryDto: RequestStatisticSummaryDto,
  ) {
    return await this.apiTradingService.statisticSummary(
      requestStatisticSummaryDto,
    )
  }

  @Get('/statistic/summary/export')
  @CheckPermission(Permission.HIGH_LOW_USER_TRADING_READ)
  @ApiBearerAuth('access-token')
  async exportStatisticSummary(
    @Query() requestStatisticSummaryDto: RequestStatisticSummaryDto,
  ) {
    return await this.apiTradingService.exportStatisticSummary(
      requestStatisticSummaryDto,
    )
  }

  @Get('/statistic/detail')
  @CheckPermission(Permission.HIGH_LOW_USER_TRADING_READ)
  @ApiBearerAuth('access-token')
  async statisticDetail(
    @Query() requestStatisticDetailDto: RequestStatisticDetailDto,
  ) {
    return await this.apiTradingService.statisticDetail(
      requestStatisticDetailDto,
    )
  }

  @Get('/statistic/detail/export')
  @CheckPermission(Permission.HIGH_LOW_USER_TRADING_READ)
  @ApiBearerAuth('access-token')
  async exportStatisticDetail(
    @Query() requestStatisticDetailDto: RequestStatisticDetailDto,
  ) {
    return await this.apiTradingService.exportStatisticDetail(
      requestStatisticDetailDto,
    )
  }

  @Get('/statistic/user')
  @CheckPermission(Permission.HIGH_LOW_USER_TRADING_READ)
  @ApiBearerAuth('access-token')
  async statisticUser(
    @Query() requestStatisticUserDto: RequestStatisticUserDto,
  ) {
    return await this.apiTradingService.statisticUser(requestStatisticUserDto)
  }

  @Get('/statistic/user/export')
  @CheckPermission(Permission.HIGH_LOW_USER_TRADING_READ)
  @ApiBearerAuth('access-token')
  async exportStatisticUser(
    @Query() requestStatisticUserDto: RequestStatisticUserDto,
  ) {
    return await this.apiTradingService.exportStatisticUser(
      requestStatisticUserDto,
    )
  }

  @Get('/trading-limit-users/export')
  @CheckPermission(Permission.HIGH_LOW_USER_TRADING_READ)
  @ApiBearerAuth('access-token')
  async exportUsersTradingLimit(
    @Query() listUserTradingDTO: ListUserTradingDTO,
  ) {
    return await this.apiTradingService.exportUsersTradingLimit(
      listUserTradingDTO,
    )
  }

  @Get('/trading-limit-users')
  @CheckPermission(Permission.HIGH_LOW_USER_TRADING_READ)
  @ApiBearerAuth('access-token')
  async usersTradingLimit(@Query() listUserTradingDTO: ListUserTradingDTO) {
    return await this.apiTradingService.usersTradingLimit(listUserTradingDTO)
  }

  @Get('/suspension/users')
  @CheckPermission(Permission.HIGH_LOW_USER_TRADING_READ)
  @ApiBearerAuth('access-token')
  async suspensionUsers(@Query() listUserTradingDTO: ListUserTradingDTO) {
    return await this.apiTradingService.suspensionUsers(listUserTradingDTO)
  }

  @Get('/suspension/modes')
  @CheckPermission(Permission.HIGH_LOW_USER_TRADING_READ)
  @ApiBearerAuth('access-token')
  async suspensionModes(
    @Query() listUserTradingDTO: RequestSuspensionModesDto,
  ) {
    return await this.apiTradingService.suspensionModes(listUserTradingDTO)
  }

  @Get('/suspension/pairs')
  @CheckPermission(Permission.HIGH_LOW_USER_TRADING_READ)
  @ApiBearerAuth('access-token')
  async suspensionPairs(@Query() listUserTradingDTO: ListUserTradingDTO) {
    return await this.apiTradingService.suspensionPairs(listUserTradingDTO)
  }

  @Get('/suspension/common/export')
  @CheckPermission(Permission.HIGH_LOW_USER_TRADING_READ)
  @ApiBearerAuth('access-token')
  async exportSuspensionCommon(
    @Query() listUserTradingDTO: ListUserTradingDTO,
  ) {
    return await this.apiTradingService.exportSuspensionCommon(
      listUserTradingDTO,
    )
  }

  @Get('/suspension/trade-mode/export')
  @CheckPermission(Permission.HIGH_LOW_USER_TRADING_READ)
  @ApiBearerAuth('access-token')
  async exportSuspensionTradeMode(
    @Query() listUserTradingDTO: ListUserTradingDTO,
  ) {
    return await this.apiTradingService.exportSuspensionTradeMode(
      listUserTradingDTO,
    )
  }

  @Get('/suspension/market/export')
  @CheckPermission(Permission.HIGH_LOW_USER_TRADING_READ)
  @ApiBearerAuth('access-token')
  async exportSuspensionMarket(
    @Query() listUserTradingDTO: ListUserTradingDTO,
  ) {
    return await this.apiTradingService.exportSuspensionMarket(
      listUserTradingDTO,
    )
  }
}
