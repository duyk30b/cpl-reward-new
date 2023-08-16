import { Observable } from 'rxjs'
import {
  CreateBceManualDepositDto,
  GrpcCreateBceManualDepositResponse,
} from '@lib/grpc-client/wallet-bce-backend/dtos/wallet-bce-backend.dto'

export interface IWalletBceBackend {
  createBceManualDeposit: (
    request: CreateBceManualDepositDto,
  ) => Observable<GrpcCreateBceManualDepositResponse>
}
