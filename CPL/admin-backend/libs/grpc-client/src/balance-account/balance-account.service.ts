import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { plainToInstance } from 'class-transformer'
import { lastValueFrom, map } from 'rxjs'
import { BalanceAccountDto } from './balance-account.dto'
import {
  IBalanceAccountService,
  IListForUserRequest,
} from './balance-account.interface'

@Injectable()
export class BalanceAccountService {
  protected readonly logger = new Logger(BalanceAccountService.name)
  private balanceAccountService: IBalanceAccountService
  constructor(@Inject('BALANCE_ACCOUNT_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.balanceAccountService = this.client.getService<IBalanceAccountService>(
      'BalanceAccountService',
    )
  }

  async listForUser(listForUserRequest: IListForUserRequest) {
    this.logger.debug('gRPC: Run listForUser')

    try {
      const result = await lastValueFrom(
        this.balanceAccountService
          .listForUser(listForUserRequest)
          .pipe(map((data) => plainToInstance(BalanceAccountDto, data.items))),
      )

      return result
    } catch (error) {
      this.logger.error(
        'Error call Grpc balance account:' + JSON.stringify(error),
      )
      throw new Error(error)
    }
  }
}
