import { GrpcUserTradingService } from '@lib/grpc-client/bo/user-trading/user-trading.service'
import { BadRequestException, Injectable } from '@nestjs/common'

@Injectable()
export class UserTradingService {
  /**
   * constructor
   * @param boTradingService
   */
  constructor(private readonly boTradingService: GrpcUserTradingService) {}

  /**
   * list
   * @param listUserTradingDto
   * @returns
   */
  async list(listUserTradingDto) {
    const data = await this.boTradingService.list(listUserTradingDto)
    return data.data
  }

  /**
   * export
   * @param filter
   * @returns
   */
  async export(filter) {
    return await this.boTradingService.export(filter)
  }

  /**
   * statisticSummary
   * @param requestStatisticSummaryDto
   * @returns
   */
  async statisticSummary(requestStatisticSummaryDto) {
    try {
      const data = await this.boTradingService.statisticSummary(
        requestStatisticSummaryDto,
      )
      return data.data
    } catch (e) {
      throw new BadRequestException(e)
    }
  }

  /**
   * exportStatisticSummary
   * @param requestStatisticSummaryDto
   * @returns
   */
  async exportStatisticSummary(requestStatisticSummaryDto) {
    try {
      const data = await this.boTradingService.exportStatisticSummary(
        requestStatisticSummaryDto,
      )
      return data.data
    } catch (e) {
      throw new BadRequestException(e)
    }
  }

  /**
   * statisticDetail
   * @param listUserTradingDto
   * @returns
   */
  async statisticDetail(listUserTradingDto) {
    try {
      const data = await this.boTradingService.statisticDetail(
        listUserTradingDto,
      )
      return data.data
    } catch (e) {
      throw new BadRequestException(e)
    }
  }

  /**
   * exportStatisticDetail
   * @param listUserTradingDto
   * @returns
   */
  async exportStatisticDetail(listUserTradingDto) {
    try {
      const data = await this.boTradingService.exportStatisticDetail(
        listUserTradingDto,
      )
      return data.data
    } catch (e) {
      throw new BadRequestException(e)
    }
  }

  /**
   * statisticUser
   * @param listUserTradingDto
   * @returns
   */
  async statisticUser(listUserTradingDto) {
    try {
      const data = await this.boTradingService.statisticUser(listUserTradingDto)
      return data.data
    } catch (e) {
      throw new BadRequestException(e)
    }
  }

  /**
   * exportStatisticUser
   * @param listUserTradingDto
   * @returns
   */
  async exportStatisticUser(listUserTradingDto) {
    try {
      const data = await this.boTradingService.exportStatisticUser(
        listUserTradingDto,
      )
      return data.data
    } catch (e) {
      throw new BadRequestException(e)
    }
  }

  /**
   * usersTradingLimit
   * @param listUserTradingDto
   * @returns
   */
  async usersTradingLimit(listUserTradingDto) {
    try {
      const data = await this.boTradingService.usersTradingLimit(
        listUserTradingDto,
      )
      return data.data
    } catch (e) {
      throw new BadRequestException(e)
    }
  }

  /**
   * exportUsersTradingLimit
   * @param listUserTradingDto
   * @returns
   */
  async exportUsersTradingLimit(listUserTradingDto) {
    const data = await this.boTradingService.exportUsersTradingLimit(
      listUserTradingDto,
    )
    return data.data
  }

  /**
   * suspensionUsers
   * @param listUserTradingDto
   * @returns
   */
  async suspensionUsers(listUserTradingDto) {
    try {
      const data = await this.boTradingService.suspensionUsers(
        listUserTradingDto,
      )
      return data.data
    } catch (e) {
      throw new BadRequestException(e)
    }
  }

  /**
   * suspensionModes
   * @param listUserTradingDto
   * @returns
   */
  async suspensionModes(listUserTradingDto) {
    try {
      const data = await this.boTradingService.suspensionModes(
        listUserTradingDto,
      )
      return data.data
    } catch (e) {
      throw new BadRequestException(e)
    }
  }

  /**
   * suspensionPairs
   * @param listUserTradingDto
   * @returns
   */
  async suspensionPairs(listUserTradingDto) {
    try {
      const data = await this.boTradingService.suspensionPairs(
        listUserTradingDto,
      )
      return data.data
    } catch (e) {
      throw new BadRequestException(e)
    }
  }

  /**
   * exportSuspensionCommon
   * @param listUserTradingDto
   * @returns
   */
  async exportSuspensionCommon(listUserTradingDto) {
    return await this.boTradingService.exportSuspensionCommon(
      listUserTradingDto,
    )
  }

  /**
   * exportSuspensionTradeMode
   * @param listUserTradingDto
   * @returns
   */
  async exportSuspensionTradeMode(listUserTradingDto) {
    return await this.boTradingService.exportSuspensionTradeMode(
      listUserTradingDto,
    )
  }

  /**
   * exportSuspensionTradeMode
   * @param listUserTradingDto
   * @returns
   */
  async exportSuspensionMarket(listUserTradingDto) {
    return await this.boTradingService.exportSuspensionMarket(
      listUserTradingDto,
    )
  }
}
