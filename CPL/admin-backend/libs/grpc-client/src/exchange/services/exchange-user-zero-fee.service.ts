import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { plainToInstance } from 'class-transformer'
import { lastValueFrom, map } from 'rxjs'
import { Constants } from '../constants'
import { IExchangeUserZeroFee } from '../interfaces/user-zero-fee.interface'
import {
  GrpcUserZeroFeePaginationResponse,
  UserZeroFeeDto,
  UpdateUserZeroFeeRequestDto,
  GetUserZeroFeeQuery,
} from '../dtos/user-zero-fee.dto'

@Injectable()
export class ExchangeUserZeroFeeService implements OnModuleInit {
  private logger = new Logger(ExchangeUserZeroFeeService.name)
  private userZeroFeeService: IExchangeUserZeroFee
  constructor(
    @Inject(Constants.GRPC_EX_USER_ZERO_FEE_TOKEN)
    private readonly client: ClientGrpc,
  ) {}
  onModuleInit() {
    this.userZeroFeeService = this.client.getService(
      Constants.GRPC_EX_USER_ZERO_FEE_SERVICE,
    )
  }

  public async getUserZeroFee(
    queryDto: GetUserZeroFeeQuery,
  ): Promise<GrpcUserZeroFeePaginationResponse> {
    return await lastValueFrom(
      this.userZeroFeeService.getUserZeroFee(queryDto).pipe(
        map((response) =>
          plainToInstance(GrpcUserZeroFeePaginationResponse, response, {
            exposeDefaultValues: true,
          }),
        ),
      ),
    )
  }

  public async updateUserZeroFee(
    request: UpdateUserZeroFeeRequestDto,
  ): Promise<UserZeroFeeDto> {
    return lastValueFrom(
      this.userZeroFeeService.updateUserZeroFee(request).pipe(
        map((response) =>
          plainToInstance(UserZeroFeeDto, response, {
            exposeDefaultValues: true,
          }),
        ),
      ),
    )
  }
}
