import {
  BadRequestException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common'
import { IWalletBceBackend } from '@lib/grpc-client/wallet-bce-backend/interfaces/wallet-bce-backend.interface'
import { ClientGrpc } from '@nestjs/microservices'
import { Constants } from '@lib/grpc-client/wallet-bce-backend/constants'
import { catchError, lastValueFrom, map } from 'rxjs'
import { ParseResponseGrpcHotWallet } from '@lib/grpc-client'
import {
  CreateBceManualDepositDto,
  GrpcCreateBceManualDepositResponse,
} from '@lib/grpc-client/wallet-bce-backend/dtos/wallet-bce-backend.dto'

@Injectable()
export class WalletBceBackendService implements OnModuleInit {
  private grpcWalletBceBackend: IWalletBceBackend

  constructor(
    @Inject(Constants.GRPC_WALLET_BCE_BACKEND_TOKEN)
    private clientGrpc: ClientGrpc,
  ) {}

  onModuleInit() {
    this.grpcWalletBceBackend = this.clientGrpc.getService(
      Constants.GRPC_WALLET_BCE_BACKEND_SERVICE,
    )
  }

  async createBceManualDeposit(
    body: CreateBceManualDepositDto,
  ): Promise<GrpcCreateBceManualDepositResponse> {
    return lastValueFrom(
      this.grpcWalletBceBackend.createBceManualDeposit(body).pipe(
        map((result) =>
          ParseResponseGrpcHotWallet(
            GrpcCreateBceManualDepositResponse,
            result,
          ),
        ),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }
}
