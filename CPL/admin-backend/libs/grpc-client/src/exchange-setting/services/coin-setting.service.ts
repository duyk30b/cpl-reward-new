import { BasePaginationQueryDto } from '@app/common/base-pagination.dto'
import {
  BadRequestException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { plainToInstance } from 'class-transformer'
import { catchError, lastValueFrom, map } from 'rxjs'
import { Constants } from '../constants'
import {
  CreateCoinSettingDto,
  DeleteCoinSetting,
  GetListCoinNameRequest,
  GrpcCoinSettingDto,
  GrpcCoinSettingPaginationResponse,
  GrpcGetListCoinNameResponse,
} from '../dtos/coin/'
import { IGrpcCoinSetting } from '../interfaces'

@Injectable()
export class CoinSettingService implements OnModuleInit {
  private grpcCoinSetting: IGrpcCoinSetting

  constructor(
    @Inject(Constants.GRPC_EXCHANGE_SETTING_TOKEN)
    private readonly clientGrpc: ClientGrpc,
  ) {}

  public onModuleInit() {
    this.grpcCoinSetting = this.clientGrpc.getService(
      Constants.GRPC_COIN_SETTING_SERVICE,
    )
  }

  public getCoins(
    query: BasePaginationQueryDto,
  ): Promise<GrpcCoinSettingPaginationResponse> {
    return lastValueFrom(
      this.grpcCoinSetting.getCoinSettingByPagination(query).pipe(
        map((result) =>
          plainToInstance(GrpcCoinSettingPaginationResponse, result, {
            exposeDefaultValues: true,
          }),
        ),
      ),
    )
  }

  public getListCoinName(
    query: GetListCoinNameRequest,
  ): Promise<GrpcGetListCoinNameResponse> {
    return lastValueFrom(
      this.grpcCoinSetting.getListCoinName(query).pipe(
        map((result) =>
          plainToInstance(GrpcGetListCoinNameResponse, result, {
            exposeDefaultValues: true,
          }),
        ),
      ),
    )
  }

  public getCoin(coin: string): Promise<GrpcCoinSettingDto> {
    return lastValueFrom(
      this.grpcCoinSetting.getCoinSetting({ coin }).pipe(
        map((result) => plainToInstance(GrpcCoinSettingDto, result)),
        catchError((error) => {
          throw new BadRequestException(error)
        }),
      ),
    )
  }

  public setCoin(request: CreateCoinSettingDto): Promise<GrpcCoinSettingDto> {
    return lastValueFrom(
      this.grpcCoinSetting
        .setCoinSetting(request)
        .pipe(map((result) => plainToInstance(GrpcCoinSettingDto, result))),
    )
  }

  public deleteCoinSetting(coin: string): Promise<DeleteCoinSetting> {
    return lastValueFrom(this.grpcCoinSetting.deleteCoinSetting({ coin }))
  }
}
