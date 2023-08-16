import { ILoginHistoryFilter, LoginHistoryService } from '@lib/login-history'
import { Injectable } from '@nestjs/common'
import { LoginHistoryFilterDto } from './auth-login-history.dto'

@Injectable()
export class AuthLoginHistoryService {
  constructor(private readonly loginHistoryService: LoginHistoryService) {}

  async getListHistory(
    userId: string,
    loginHistoryFilterDto: LoginHistoryFilterDto,
  ) {
    return await this.loginHistoryService.getListHistoryForUser(
      userId,
      loginHistoryFilterDto as unknown as ILoginHistoryFilter,
    )
  }
}
