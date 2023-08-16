import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { CommonSettingConstant } from '@lib/grpc-client/common-setting/common-setting.constant'
import { ClientGrpc } from '@nestjs/microservices'
import {
  FuturesSetting,
  IDeleteSettingDto,
  IGetFuturesSettingDto,
  IGetSingleSettingDto,
  IUpdateStatusDto,
  ODeleteSettingResponse,
  OUpdateSettingResponse,
  SettingResponse,
  SingleSettingResponse,
} from './futures-setting.dto'
import { lastValueFrom, map } from 'rxjs'
import { plainToInstance } from 'class-transformer'
import { IFuturesSetting } from './futures-setting.interface'

@Injectable()
export class FuturesSettingService implements OnModuleInit {
  private futuresSetting: IFuturesSetting

  constructor(
    @Inject(CommonSettingConstant.GRPC_FUTURES_SETTING_TOKEN)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.futuresSetting = this.client.getService<IFuturesSetting>(
      CommonSettingConstant.GRPC_FUTURES_SETTING_SERVICE,
    )
  }

  public getSettings(input: IGetFuturesSettingDto): Promise<SettingResponse> {
    return lastValueFrom(
      this.futuresSetting.getSettings(input).pipe(
        map((result) =>
          plainToInstance(SettingResponse, result, {
            ignoreDecorators: true,
          }),
        ),
      ),
    )
  }

  public getSingleSetting(
    input: IGetSingleSettingDto,
  ): Promise<SingleSettingResponse> {
    return lastValueFrom(
      this.futuresSetting.getSingleSetting(input).pipe(
        map((result) =>
          plainToInstance(SingleSettingResponse, result, {
            ignoreDecorators: true,
          }),
        ),
      ),
    )
  }

  public setFuturesSetting(input: FuturesSetting): Promise<FuturesSetting> {
    return lastValueFrom(
      this.futuresSetting
        .setFuturesSetting(input)
        .pipe(map((result) => plainToInstance(FuturesSetting, result))),
    )
  }

  public deleteFuturesSetting(
    input: IDeleteSettingDto,
  ): Promise<ODeleteSettingResponse> {
    return lastValueFrom(
      this.futuresSetting
        .deleteFuturesSetting(input)
        .pipe(map((result) => plainToInstance(ODeleteSettingResponse, result))),
    )
  }

  public updateStatusSetting(
    input: IUpdateStatusDto,
  ): Promise<OUpdateSettingResponse> {
    return lastValueFrom(
      this.futuresSetting
        .updateStatusSetting(input)
        .pipe(map((result) => plainToInstance(OUpdateSettingResponse, result))),
    )
  }
}
