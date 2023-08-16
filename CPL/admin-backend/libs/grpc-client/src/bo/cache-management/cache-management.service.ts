import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
import { ParseResponseGrpc } from '../../grpc-client.helper'
import { GrpcCacheManagementResponseDTO } from './cache-management.dto'
import {
  IGrpcCacheManagementRequest,
  IGrpcCacheManagementService,
} from './cache-management.interface'

@Injectable()
export class GrpcCacheManagementService {
  private grpcCacheManagementService: IGrpcCacheManagementService

  /**
   * constructor
   * @param client
   */
  constructor(
    @Inject('BO_CACHE_MANAGEMENT_PACKAGE') private client: ClientGrpc,
  ) {}

  /**
   * onModuleInit
   */
  onModuleInit() {
    this.grpcCacheManagementService =
      this.client.getService<IGrpcCacheManagementService>(
        'BOCacheManagementService',
      )
  }

  /**
   * delete
   * @param deleteRequest
   * @returns
   */
  async delete(
    deleteRequest: IGrpcCacheManagementRequest,
  ): Promise<GrpcCacheManagementResponseDTO> {
    const result = await lastValueFrom(
      this.grpcCacheManagementService.delete(deleteRequest),
    )

    return result
  }
}
