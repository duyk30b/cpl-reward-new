import { GrpcCacheManagementService } from '@lib/grpc-client/bo/cache-management/cache-management.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class LeaderBoardService {
  /**
   * constructor
   * @param grpcCacheManagementService
   */
  constructor(
    private readonly grpcCacheManagementService: GrpcCacheManagementService,
  ) {}

  /**
   * delete
   * @param deleteDto
   * @returns
   */
  async delete(deleteDto) {
    return this.grpcCacheManagementService.delete(deleteDto)
  }
}
