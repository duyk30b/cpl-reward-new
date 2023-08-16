import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { plainToInstance } from 'class-transformer'
import { lastValueFrom, map } from 'rxjs'
import { Constants } from '../constants'
import {
  GrpcListPairNameResponse,
  GrpcPairSettingPaginationResponse,
  UpdatePairSettingItemDto,
} from '../dtos/pair-setting'
import {
  DeletePairSettingParamDto,
  GetPairSettingPaginationDto,
  PairSettingFilterDto,
  PairSettingItemDto,
  PairSettingParamsDto,
  PairSettingWithOBMDto,
} from '../dtos/pair-setting/pair-setting.dto'
import { IGrpcPairSetting } from '../interfaces'

@Injectable()
export class PairSettingService implements OnModuleInit {
  private grpcPairSetting: IGrpcPairSetting

  constructor(
    @Inject(Constants.GRPC_EXCHANGE_SETTING_TOKEN)
    private readonly clientGrpc: ClientGrpc,
  ) {}

  public onModuleInit() {
    this.grpcPairSetting = this.clientGrpc.getService(
      Constants.GRPC_PAIR_SETTING_SERVICE,
    )
  }

  public getListPairSetting(
    params: PairSettingFilterDto,
  ): Promise<PairSettingWithOBMDto[]> {
    return lastValueFrom(
      this.grpcPairSetting
        .getPairSetting({ coin: params.coin, currency: params.currency })
        .pipe(
          map((result) =>
            plainToInstance(PairSettingWithOBMDto, result.data, {
              exposeDefaultValues: true,
            }),
          ),
        ),
    )
  }

  public getPairs(
    query: GetPairSettingPaginationDto,
  ): Promise<GrpcPairSettingPaginationResponse> {
    return lastValueFrom(
      this.grpcPairSetting.getPairSettingByPagination(query).pipe(
        map((result) =>
          plainToInstance(GrpcPairSettingPaginationResponse, result, {
            exposeDefaultValues: true,
          }),
        ),
      ),
    )
  }

  public getListPairName(): Promise<GrpcListPairNameResponse> {
    return lastValueFrom(
      this.grpcPairSetting.getListPairName({}).pipe(
        map((result) =>
          plainToInstance(GrpcListPairNameResponse, result, {
            exposeDefaultValues: true,
          }),
        ),
      ),
    )
  }

  public setPairSetting(
    pairItem: UpdatePairSettingItemDto,
    userId: string,
  ): Promise<PairSettingItemDto> {
    return lastValueFrom(
      this.grpcPairSetting
        .setPairSetting({ ...pairItem, userId })
        .pipe(map((result) => plainToInstance(PairSettingWithOBMDto, result))),
    )
  }

  public getPairSetting(
    coin: string,
    currency: string,
  ): Promise<PairSettingWithOBMDto> {
    return lastValueFrom(
      this.grpcPairSetting
        .getSinglePairSetting({ coin, currency })
        .pipe(
          map((result) => plainToInstance(PairSettingWithOBMDto, result.data)),
        ),
    )
  }

  public deletePairSetting(
    coin: string,
    currency: string,
    userId: string,
  ): Promise<PairSettingParamsDto> {
    return lastValueFrom(
      this.grpcPairSetting
        .deletePairSetting(
          plainToInstance(DeletePairSettingParamDto, {
            coin,
            currency,
            user_id: userId,
          }),
        )
        .pipe(map((result) => plainToInstance(PairSettingParamsDto, result))),
    )
  }
}
