import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import {
  IListUserLoginHistory,
  ILoginHistoryFilter,
  IUserLoginHistoryService,
} from './login-history.interface'
import { lastValueFrom } from 'rxjs'
import { plainToInstance } from 'class-transformer'
import { LoginHistoryListDto } from '@lib/grpc-client/login-history/login-history.dto'

@Injectable()
export class LoginHistoryService {
  private userLoginHistoryService: IUserLoginHistoryService
  constructor(@Inject('USER_LOGIN_HISTORY') private client: ClientGrpc) {}

  onModuleInit() {
    this.userLoginHistoryService =
      this.client.getService<IUserLoginHistoryService>(
        'GrpcLoginHistoryService',
      )
  }

  async getListUserLoginHistory(
    loginHistoryFilter: ILoginHistoryFilter,
  ): Promise<IListUserLoginHistory> {
    const req =
      this.userLoginHistoryService.getListLoginHistory(loginHistoryFilter)
    const data = await lastValueFrom(req)
    data.data = (data.data || []).map((item) =>
      plainToInstance(LoginHistoryListDto, item, { ignoreDecorators: true }),
    )
    return data
  }
}
