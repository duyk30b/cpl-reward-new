import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
import { IExchangeUserUnlimitedService } from './exchange-user-unlimited.interface'

@Injectable()
export class ExchangeUserUnlimitedService implements OnModuleInit {
  private exchangeUserUnlimitedService: IExchangeUserUnlimitedService
  constructor(@Inject('EXCHANGE_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.exchangeUserUnlimitedService =
      this.client.getService<IExchangeUserUnlimitedService>(
        'ExchangeUserUnlimitedService',
      )
  }

  async checkUserUnlimited(userId: string): Promise<boolean> {
    const response = this.exchangeUserUnlimitedService.checkUserIsUnlimited({
      userId,
    })
    const data = await lastValueFrom(response)
    return data.isUnlimited
  }
}
