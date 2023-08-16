import { GrpcTradingPairService } from '@lib/grpc-client/bo/trading-pair/trading-pair.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class TradingPairService {
  constructor(private readonly boTradingService: GrpcTradingPairService) {}

  async create(createTradingPairDto) {
    return await this.boTradingService.create(createTradingPairDto)
  }

  async findAll(listTradingPairDto) {
    const data = await this.boTradingService.findAll(listTradingPairDto)
    return data.data
  }

  async findOneById(findOneByIdDto) {
    return await this.boTradingService.findOne(findOneByIdDto)
  }

  async update(id: number, updateTradingPairDto) {
    updateTradingPairDto.id = id
    return await this.boTradingService.update(updateTradingPairDto)
  }

  async updateStatus(id: number, updateTradingPairDto) {
    updateTradingPairDto.id = id
    return await this.boTradingService.update(updateTradingPairDto)
  }

  async delete(deleteDto) {
    return await this.boTradingService.delete(deleteDto)
  }
}
