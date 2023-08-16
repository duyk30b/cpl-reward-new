import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { plainToInstance } from 'class-transformer'
import { lastValueFrom, map } from 'rxjs'
import { Constants } from '../constants'
import {
  BaseGridTradingSettingItemDto,
  DeleteGridTradingRequestDto,
  DeleteGridTradingResponseDto,
  GetGridTradingPaginationDto,
  GridTradingSettingItemDto,
  GrpcGridTradingSettingPaginationResponse,
  GrpcListPairNameResponse,
  UpdateOrderOfPairRequestDto,
  UpdateOrderOfPairResponse,
} from '../dtos'
import { IGrpcGridTradingSetting } from '../interfaces/grid-trading.interface'

@Injectable()
export class GridTradingSettingService implements OnModuleInit {
  private grpcGridTrading: IGrpcGridTradingSetting

  constructor(
    @Inject(Constants.GRPC_GRID_TRADING_SETTING_TOKEN)
    private readonly clientGrpc: ClientGrpc,
  ) {}

  public onModuleInit() {
    this.grpcGridTrading = this.clientGrpc.getService(
      Constants.GRPC_GRID_TRADING_SETTING_SERVICE,
    )
  }

  public getGridTrading(): Promise<GridTradingSettingItemDto[]> {
    return lastValueFrom(
      this.grpcGridTrading.getGridTrading({}).pipe(
        map((result) =>
          plainToInstance(GridTradingSettingItemDto, result.data, {
            exposeDefaultValues: true,
          }),
        ),
      ),
    )
  }

  public getGridTradingByPagination(
    query: GetGridTradingPaginationDto,
  ): Promise<GrpcGridTradingSettingPaginationResponse> {
    return lastValueFrom(
      this.grpcGridTrading.getGridTradingByPagination(query).pipe(
        map((result) =>
          plainToInstance(GrpcGridTradingSettingPaginationResponse, result, {
            exposeDefaultValues: true,
          }),
        ),
      ),
    )
  }

  public setGridTrading(
    request: BaseGridTradingSettingItemDto,
  ): Promise<GridTradingSettingItemDto> {
    return lastValueFrom(
      this.grpcGridTrading
        .setGridTrading(request)
        .pipe(
          map((result) => plainToInstance(GridTradingSettingItemDto, result)),
        ),
    )
  }

  public deleteGridTrading(id: string): Promise<DeleteGridTradingResponseDto> {
    return lastValueFrom(
      this.grpcGridTrading
        .deleteGridTrading(
          plainToInstance(DeleteGridTradingRequestDto, {
            id,
          }),
        )
        .pipe(
          map((result) =>
            plainToInstance(DeleteGridTradingResponseDto, result),
          ),
        ),
    )
  }

  public async updateOrderOfPair(
    item: UpdateOrderOfPairRequestDto,
  ): Promise<UpdateOrderOfPairResponse> {
    return lastValueFrom(this.grpcGridTrading.updateOrderOfPair(item))
  }

  public async getAllPairName(): Promise<GrpcListPairNameResponse> {
    return lastValueFrom(this.grpcGridTrading.getAllPairName({}))
  }
}
