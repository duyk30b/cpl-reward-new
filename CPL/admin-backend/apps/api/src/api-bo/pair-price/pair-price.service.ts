import { GrpcPairPriceService } from '@lib/grpc-client/bo/pair-price/pair-price.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PairPriceService {
  constructor(private readonly boTradingService: GrpcPairPriceService) {}

  async create(createPairPriceDto) {
    return await this.boTradingService.create(createPairPriceDto)
  }

  async findAll(listPairPriceDto) {
    const data = await this.boTradingService.findAll(listPairPriceDto)
    return data.data
  }

  async findOneById(findOneByIdDto) {
    return await this.boTradingService.findOne(findOneByIdDto)
  }

  async update(id: number, updatePairPriceDto) {
    updatePairPriceDto.id = id
    return await this.boTradingService.update(updatePairPriceDto)
  }

  async delete(deleteDto) {
    return await this.boTradingService.delete(deleteDto)
  }
}
