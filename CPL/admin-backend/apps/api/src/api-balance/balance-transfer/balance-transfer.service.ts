import {
  ClassSerializerInterceptor,
  Injectable,
  UseInterceptors,
} from '@nestjs/common'
import { GBalanceTransferService } from '@lib/grpc-client/balance-transfer/balance-transfer.service'
import { instanceToPlain } from 'class-transformer'
import {
  ListBalanceTransferDto,
  TransferRequestDto,
} from './balance-transfer.dto'
import { ISelfTransferRequest } from '@lib/grpc-client/balance-transfer/balance-transfer.interface'
import { BALANCE_TYPE } from '../balance.enum'

@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
export class BalanceTransferService {
  constructor(private gBalanceTransferService: GBalanceTransferService) {}

  async list(listTransferRequest: ListBalanceTransferDto) {
    const balanceTransfers = await this.gBalanceTransferService.listTransfer(
      listTransferRequest,
    )
    return instanceToPlain(balanceTransfers)
  }

  async transfer(transferRequestDto: TransferRequestDto) {
    const transferInfo: ISelfTransferRequest = {
      userId: transferRequestDto.user_id,
      balanceTypeFrom: BALANCE_TYPE[transferRequestDto.balance_type_from],
      balanceTypeTo: BALANCE_TYPE[transferRequestDto.balance_type_to],
      currency: transferRequestDto.currency,
      amount: transferRequestDto.amount,
    }

    const resultTransfer = await this.gBalanceTransferService.selfTransfer(
      transferInfo,
    )

    return instanceToPlain(resultTransfer)
  }
}
