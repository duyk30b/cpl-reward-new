import { GrpcWinningRateService } from '@lib/grpc-client/bo/winning-rate/winning-rate.service'
import { BadRequestException, Injectable } from '@nestjs/common'

@Injectable()
export class WinningRateService {
  constructor(private readonly boWinningRateService: GrpcWinningRateService) {}

  async getBySeconds(request) {
    try {
      const data = await this.boWinningRateService.getBySeconds(request)
      return data.data
    } catch (e) {
      throw new BadRequestException(e)
    }
  }

  async getByMinutes(request) {
    try {
      const data = await this.boWinningRateService.getByMinutes(request)
      return data.data
    } catch (e) {
      throw new BadRequestException(e)
    }
  }

  async getByHours(request) {
    try {
      const data = await this.boWinningRateService.getByHours(request)
      return data.data
    } catch (e) {
      throw new BadRequestException(e)
    }
  }
}
