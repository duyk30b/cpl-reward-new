import { GrpcSwapsService } from '@lib/grpc-client/bo/swaps'
import { Injectable } from '@nestjs/common'

@Injectable()
export class SwapsService {
  /**
   * constructor
   * @param grpcSwapsService
   */
  constructor(private readonly grpcSwapsService: GrpcSwapsService) {}

  /**
   * export
   * @param listSwapsDto
   * @returns
   */
  async export(listSwapsDto) {
    return await this.grpcSwapsService.export(listSwapsDto)
  }
}
