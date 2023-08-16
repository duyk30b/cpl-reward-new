import { Controller, Get, Query, Req } from '@nestjs/common'
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger'
import { ApiCommon } from '../../api-docs/common-headers'
import { IRequestWithAccessToken } from '../../interfaces/request-with-access-token'
import { LoginHistoryFilterDto } from './auth-login-history.dto'
import { AuthLoginHistoryService } from './auth-login-history.service'

@ApiTags('login-history')
@ApiHeader(ApiCommon.device)
@Controller('login-history')
export class AuthLoginHistoryController {
  constructor(
    private readonly authLoginHistoryService: AuthLoginHistoryService,
  ) {}

  @Get()
  @ApiBearerAuth('access-token')
  async getListHistory(
    @Query() loginHistoryFilterDto: LoginHistoryFilterDto,
    @Req() request: IRequestWithAccessToken,
  ) {
    return await this.authLoginHistoryService.getListHistory(
      request.accessTokenInfo.userId,
      loginHistoryFilterDto,
    )
  }
}
