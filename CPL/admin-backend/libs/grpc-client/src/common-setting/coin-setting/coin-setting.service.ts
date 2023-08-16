import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { ERRORS } from 'apps/api/src/api-balance/balance.enum'
import { lastValueFrom } from 'rxjs'
import { CoinSettingItem } from './coin-setting.dto'
import { ICoinSettingService } from './coin-setting.interface'
import { CommonSettingConstant } from '@lib/grpc-client/common-setting/common-setting.constant'

@Injectable()
export class CoinSettingService {
  protected readonly logger = new Logger(CoinSettingService.name)
  private coinSettingService: ICoinSettingService
  constructor(
    @Inject(CommonSettingConstant.GRPC_COMMON_SETTING_COIN)
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.coinSettingService =
      this.client.getService<ICoinSettingService>('CoinSettingService')
  }

  async getAllListCoin(): Promise<CoinSettingItem[]> {
    this.logger.debug('Grpc: Call getAllListCoin function')
    try {
      const coins = await lastValueFrom(
        this.coinSettingService.getAllCoinSettings({}),
      )
      if (!coins || !coins.data || coins.data.length < 1)
        throw new InternalServerErrorException(ERRORS.CANNOT_GET_COIN_LIST)

      return coins.data.sort(function (item1, item2) {
        const coin1 = item1.coin.toLowerCase()
        const coin2 = item2.coin.toLowerCase()
        return coin1 < coin2 ? -1 : coin1 > coin2 ? 1 : 0
      })
    } catch (error) {
      this.logger.error('Error call Grpc coin setting:' + JSON.stringify(error))
      throw new Error(error)
    }
  }
}
