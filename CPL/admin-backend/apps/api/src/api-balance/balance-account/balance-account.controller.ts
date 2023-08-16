import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Param,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Permission } from '../../permissions/permission.data'
import { CheckPermission } from '../../permissions/permission.decorator'
import { BalanceAccountForUserRequest } from '../api-balance.dto'
import { TransformInterceptor } from '../transform-interceptor.interface'
import { BalanceAccountService } from './balance-account.service'

@ApiBearerAuth('access-token')
@ApiTags('balance')
@UseInterceptors(TransformInterceptor)
@Controller('balance-account')
@Injectable()
export class BalanceAccountController {
  constructor(private apiBalanceAccountService: BalanceAccountService) {}
  @Get(':user_id')
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @CheckPermission(Permission.BALANCE_READ)
  async getBalanceAccountForUser(
    @Param() params: BalanceAccountForUserRequest,
  ) {
    const result = await this.apiBalanceAccountService.balanceAccountForUser(
      params.user_id,
    )
    return result
  }
}
