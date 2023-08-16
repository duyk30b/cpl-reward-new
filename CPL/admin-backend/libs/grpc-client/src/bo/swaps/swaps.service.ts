import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
import { IGrpcSwapsListRequest, IGrpcSwapsService } from './swaps.interface'

@Injectable()
export class GrpcSwapsService {
  private grpcSwapsService: IGrpcSwapsService

  /**
   * constructor
   * @param client
   */
  constructor(@Inject('BO_SWAPS_PACKAGE') private client: ClientGrpc) {}

  /**
   * onModuleInit
   */
  onModuleInit() {
    this.grpcSwapsService =
      this.client.getService<IGrpcSwapsService>('BOSwapsService')
  }

  /**
   * export
   * @param listRequest
   * @returns
   */
  async export(listRequest: IGrpcSwapsListRequest) {
    const result = await lastValueFrom(
      this.grpcSwapsService.export(listRequest),
    )
    return result
  }
}
