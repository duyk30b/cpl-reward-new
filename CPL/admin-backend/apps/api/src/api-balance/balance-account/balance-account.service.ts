import { BalanceAccountService as GrpcBalanceAccountService } from '@lib/grpc-client/balance-account/balance-account.service'
import {
  ClassSerializerInterceptor,
  Injectable,
  UseInterceptors,
} from '@nestjs/common'
import { FixedNumber } from '@ethersproject/bignumber'
import { CoinSettingService } from '@lib/grpc-client/common-setting/coin-setting/coin-setting.service'
import { CoinSettingItem } from '@lib/grpc-client/common-setting/coin-setting/coin-setting.dto'
import { BALANCE_TYPE } from '../balance.enum'
import { plainToInstance } from 'class-transformer'
import { isNumberString } from 'class-validator'
import { BalanceAccountDto } from '@lib/grpc-client/balance-account/balance-account.dto'
import {
  IBalanceAccountTypes,
  ITotalBalanceAccountResponse,
} from '@lib/grpc-client/balance-account/balance-account.interface'
import { ConfigService } from '@nestjs/config'

@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
export class BalanceAccountService {
  constructor(
    private balanceAccountService: GrpcBalanceAccountService,
    private coinSettingService: CoinSettingService,
    private readonly configService: ConfigService,
  ) {}

  async balanceAccountForUser(userId: string) {
    const coins = await this.coinSettingService.getAllListCoin()
    const balanceAccounts = await this.balanceAccountService.listForUser({
      userId,
    })

    return this.mapDataAndConvertBalance(coins, balanceAccounts)
  }

  async mapDataAndConvertBalance(
    coins: CoinSettingItem[],
    balanceAccounts: Partial<BalanceAccountDto[]>,
  ): Promise<ITotalBalanceAccountResponse> {
    const balanceAccountResult: Partial<BalanceAccountDto>[] = []
    const balanceAccountTypes: IBalanceAccountTypes = {}

    //set balance default by currency
    coins.forEach((coinItem) => {
      balanceAccountResult.push({
        availableBalance: '0',
        actualBalance: '0',
        currency: coinItem.coin,
      })
    })

    //set total default
    let totalBalanceResult = balanceAccountResult

    //set balance default for balance type BO
    const balanceAccountBo = balanceAccountResult.filter(
      (item) => item.currency === 'bcast' || item.currency === 'usdt',
    )

    // set balance default for balance type Future
    const balanceAccountFuture = balanceAccountResult.filter(
      (item) => item.currency === 'usdt',
    )

    const defaultBalanceAccountTypes = {
      [BALANCE_TYPE[BALANCE_TYPE.BO]]: balanceAccountBo,
      [BALANCE_TYPE[BALANCE_TYPE.FUTURES]]: balanceAccountFuture,
    }

    for (const type in BALANCE_TYPE) {
      if (isNumberString(type)) continue

      balanceAccountTypes[type] = plainToInstance(
        BalanceAccountDto,
        defaultBalanceAccountTypes?.[type] ?? balanceAccountResult,
      )
    }

    //if balance account is empty then return balance default
    if (!balanceAccounts || balanceAccounts.length < 1) {
      return {
        items: balanceAccountTypes,
        total: plainToInstance(BalanceAccountDto, balanceAccountResult),
      }
    }

    for (const balanceAccount of balanceAccounts) {
      const balanceType = BALANCE_TYPE[balanceAccount.type]
      //set balance for balance_type
      if (!balanceAccountTypes[balanceType]) continue

      const resultBalanceAccountItem = balanceAccountTypes[balanceType].find(
        (item) => item.currency === balanceAccount.currency,
      )

      if (!resultBalanceAccountItem) continue

      resultBalanceAccountItem.actualBalance = balanceAccount.actualBalance
      resultBalanceAccountItem.availableBalance =
        balanceAccount.availableBalance

      // set total balance for currency
      totalBalanceResult = totalBalanceResult.map((totalBalance) => {
        if (totalBalance.currency !== balanceAccount.currency)
          return totalBalance

        const totalAvailableBalance = FixedNumber.from(
          totalBalance.availableBalance,
        )
          .addUnsafe(FixedNumber.from(balanceAccount.availableBalance))
          .toString()

        const totalActualBalance = FixedNumber.from(totalBalance.actualBalance)
          .addUnsafe(FixedNumber.from(balanceAccount.actualBalance))
          .toString()

        return {
          ...totalBalance,
          availableBalance: totalAvailableBalance,
          actualBalance: totalActualBalance,
        }
      })
    }

    return {
      items: balanceAccountTypes,
      total: plainToInstance(BalanceAccountDto, totalBalanceResult),
    }
  }
}
