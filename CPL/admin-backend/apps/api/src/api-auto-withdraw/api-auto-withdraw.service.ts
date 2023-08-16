import { Injectable } from '@nestjs/common'
import {
  CreateWithdrawGroupRequest,
  getListAutoWithdrawRequest,
  getListAutoWithdrawResponse,
  HealthStatusValue,
  ListWithdrawGroupRequest,
  ListWithdrawGroupResponse,
  saveAutoWithdrawRequest,
  saveAutoWithdrawResponse,
  UpdateGroupStatusRequest,
  WalletKeyValue,
  withdrawalGroupRequest,
  WithdrawGroupResponse,
  WithdrawService,
  validateDuplicateWithdrawResponse,
  DuplicateWithdrawRequest,
  CollectBalanceResponse,
} from '@lib/grpc-client/withdraw'

@Injectable()
export class ApiWithdrawService {
  constructor(private readonly withdrawService: WithdrawService) {}

  async getListWithdrawalGroup(
    query: ListWithdrawGroupRequest,
  ): Promise<ListWithdrawGroupResponse> {
    return await this.withdrawService.getListWithdrawalGroup(query)
  }

  async createWithdrawalGroup(
    body: CreateWithdrawGroupRequest,
  ): Promise<WithdrawGroupResponse> {
    return await this.withdrawService.createWithdrawalGroup(body)
  }

  async generatePrivateKey(
    body: withdrawalGroupRequest,
  ): Promise<WalletKeyValue> {
    return await this.withdrawService.generatePrivateKey(body)
  }

  async updateStatus(
    body: UpdateGroupStatusRequest,
  ): Promise<WithdrawGroupResponse> {
    return await this.withdrawService.updateStatus(body)
  }

  async getListAutoWithdraw(
    query: getListAutoWithdrawRequest,
  ): Promise<getListAutoWithdrawResponse> {
    return await this.withdrawService.getListAutoWithdraw(query)
  }

  async saveAutoWithdrawals(
    body: saveAutoWithdrawRequest,
  ): Promise<saveAutoWithdrawResponse> {
    return await this.withdrawService.saveAutoWithdrawals(body)
  }

  async health(): Promise<HealthStatusValue> {
    return await this.withdrawService.health()
  }

  async validateDuplicateAutoWithdraw(
    body: DuplicateWithdrawRequest,
  ): Promise<validateDuplicateWithdrawResponse> {
    return this.withdrawService.validateDuplicateAutoWithdraw(body)
  }

  collectionBalance(groupId: number): Promise<CollectBalanceResponse> {
    return this.withdrawService.collectionBalance(groupId)
  }
}
