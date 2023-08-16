import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { FuturesConstant } from '../futures.constant'
import { FuturesCoreInterface } from './futures-core.interface'
import { lastValueFrom, map } from 'rxjs'
import { plainToInstance } from 'class-transformer'
import {
  GetPositionListRequest,
  GetPositionListResponse,
} from './futures-core.dto'

@Injectable()
export class FuturesCoreService implements OnModuleInit {
  private futureCoreInterface: FuturesCoreInterface

  constructor(
    @Inject(FuturesConstant.GRPC_FUTURES_CORE_TOKEN)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.futureCoreInterface = this.client.getService<FuturesCoreInterface>(
      FuturesConstant.GRPC_FUTURES_CORE_POSITION_SERVICE,
    )
  }

  public getPositionList(
    request: GetPositionListRequest,
  ): Promise<GetPositionListResponse> {
    return lastValueFrom(
      this.futureCoreInterface.getPositionList(request).pipe(
        map((result) =>
          plainToInstance(GetPositionListResponse, result, {
            ignoreDecorators: true,
          }),
        ),
      ),
    )
  }
}
