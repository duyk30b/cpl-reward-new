import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
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
  DuplicateWithdrawRequest,
  validateDuplicateWithdrawResponse,
  CollectBalanceResponse,
} from './withdraw.dto'
import { IGrpcWithdrawService } from './withdraw.interface'

@Injectable()
export class WithdrawService {
  private gWithdrawService: IGrpcWithdrawService

  constructor(@Inject('WITHDRAW_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.gWithdrawService = this.client.getService<IGrpcWithdrawService>(
      'grpcAutoWithdrawService',
    )
  }

  async generatePrivateKey(
    body: withdrawalGroupRequest,
  ): Promise<WalletKeyValue> {
    const dataKey = await lastValueFrom(
      this.gWithdrawService.generatePrivateKey(body),
    ).catch((error) => {
      throw new BadRequestException(error)
    })
    return dataKey
  }

  async getListWithdrawalGroup(
    query: ListWithdrawGroupRequest,
  ): Promise<ListWithdrawGroupResponse> {
    const dataWithdrawGroup = await lastValueFrom(
      this.gWithdrawService.getListWithdrawalGroup(query),
    )
    return dataWithdrawGroup
  }

  async createWithdrawalGroup(
    body: CreateWithdrawGroupRequest,
  ): Promise<WithdrawGroupResponse> {
    const dataPost = await lastValueFrom(
      this.gWithdrawService.createWithdrawalGroup(body),
    ).catch((error) => {
      throw new BadRequestException(error)
    })
    return dataPost
  }

  async updateStatus(
    body: UpdateGroupStatusRequest,
  ): Promise<WithdrawGroupResponse> {
    const dataUpdate = await lastValueFrom(
      this.gWithdrawService.updateStatus(body),
    ).catch((error) => {
      throw new BadRequestException(error)
    })
    return dataUpdate
  }

  async saveAutoWithdrawals(
    body: saveAutoWithdrawRequest,
  ): Promise<saveAutoWithdrawResponse> {
    const dataAuto = await lastValueFrom(
      this.gWithdrawService.saveAutoWithdrawals(body),
    ).catch((error) => {
      throw new BadRequestException(error)
    })
    return dataAuto
  }

  async getListAutoWithdraw(
    query: getListAutoWithdrawRequest,
  ): Promise<getListAutoWithdrawResponse> {
    const dataWithdraw = await lastValueFrom(
      this.gWithdrawService.getListAutoWithdraw(query),
    ).catch((error) => {
      throw new BadRequestException(error)
    })
    return dataWithdraw
  }

  async health(): Promise<HealthStatusValue> {
    const healthCheck = await lastValueFrom(this.gWithdrawService.Health())
    return healthCheck
  }

  async validateDuplicateAutoWithdraw(
    body: DuplicateWithdrawRequest,
  ): Promise<validateDuplicateWithdrawResponse> {
    const dataUpdate = await lastValueFrom(
      this.gWithdrawService.validateDuplicateAutoWithdraw(body),
    ).catch((error) => {
      throw new BadRequestException(error)
    })

    return dataUpdate
  }

  async collectionBalance(groupId: number): Promise<CollectBalanceResponse> {
    const collectionResponse = await lastValueFrom(
      this.gWithdrawService.collectAutoWithdrawalGroup({ id: groupId }),
    ).catch((error) => {
      throw new BadRequestException(error)
    })
    return collectionResponse
  }
}
