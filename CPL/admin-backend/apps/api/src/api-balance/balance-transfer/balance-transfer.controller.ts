import {
  BalanceTransferResultDto,
  ListBalanceTransferResult,
} from '@lib/grpc-client/balance-transfer/balance-transfer.dto'
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Post,
  Query,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Permission } from '../../permissions/permission.data'
import { CheckPermission } from '../../permissions/permission.decorator'
import {
  ListBalanceTransferDto,
  TransferRequestDto,
} from './balance-transfer.dto'
import { BalanceTransferService } from './balance-transfer.service'

@ApiBearerAuth('access-token')
@ApiTags('balance')
@Controller('balance-transfer')
@Injectable()
export class BalanceTransferController {
  constructor(private apiBalanceTransferService: BalanceTransferService) {}
  @Get('list')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: ListBalanceTransferResult })
  @HttpCode(HttpStatus.OK)
  @CheckPermission(Permission.BALANCE_TRANSFER_READ)
  async list(@Query() listBalanceTransferDto: ListBalanceTransferDto) {
    return await this.apiBalanceTransferService.list(listBalanceTransferDto)
  }

  @Post('transfer')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: BalanceTransferResultDto })
  @HttpCode(HttpStatus.OK)
  @CheckPermission(Permission.BALANCE_TRANSFER_SELF_TRANSFER)
  async transfer(@Body() transferRequestDto: TransferRequestDto) {
    return await this.apiBalanceTransferService.transfer(transferRequestDto)
  }
}
