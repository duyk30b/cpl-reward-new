import { BalanceConvertService as GrpcBalanceConvertService } from '@lib/grpc-client/balance-convert/balance-convert.service'
import {
  ClassSerializerInterceptor,
  Injectable,
  UseInterceptors,
} from '@nestjs/common'
import {
  ListBalanceConvertRequest,
  ListBalanceConvertLogRequest,
  CreateBalanceConvertRequest,
  UpdateBalanceConvertRequest,
} from '@lib/grpc-client/balance-convert/balance-convert.dto'

@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
export class ApiBalanceConvertService {
  constructor(private gRPCBalanceConvertService: GrpcBalanceConvertService) {}

  async listBalanceConvert(params: ListBalanceConvertRequest) {
    return this.gRPCBalanceConvertService.listBalanceConvert(params)
  }

  async listBalanceConvertLog(params: ListBalanceConvertLogRequest) {
    return this.gRPCBalanceConvertService.listBalanceConvertLog(params)
  }

  async getBalanceConvert(id: string) {
    return this.gRPCBalanceConvertService.getBalanceConvert(id)
  }

  async createBalanceConvert(body: CreateBalanceConvertRequest) {
    return this.gRPCBalanceConvertService.createBalanceConvert(body)
  }

  async updateBalanceConvert(body: UpdateBalanceConvertRequest) {
    return this.gRPCBalanceConvertService.updateBalanceConvert(body)
  }

  async deleteBalanceConvert(id: string) {
    return this.gRPCBalanceConvertService.deleteBalanceConvert(id)
  }
}
