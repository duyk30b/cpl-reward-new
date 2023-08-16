import { Injectable, Logger } from '@nestjs/common'
import { AdminService } from '@lib/admin'
import { WalletBceAdminService } from '@lib/grpc-client/wallet-bce-admin/services'
import {
  AdminEntityDto,
  BceDownloadFileExportRequest,
  BceDownloadFileExportResponse,
  BceTransactionDetailRequest,
} from '@lib/grpc-client/wallet-bce-admin/dtos/wallet-bce-admin.dto'
import { UploadFileService } from '@lib/upload-file/upload-file.service'
import { ParseResponseGrpcHotWallet } from '@lib/grpc-client'
import { instanceToPlain, plainToInstance } from 'class-transformer'
@Injectable()
export class ApiWalletBceAdminService {
  protected readonly logger = new Logger(ApiWalletBceAdminService.name)
  constructor(
    private readonly walletBceAdminService: WalletBceAdminService,
    private readonly adminService: AdminService,
    private readonly uploadFileService: UploadFileService,
  ) {}

  async getTransactionDetail(query: BceTransactionDetailRequest) {
    const transactionDetailResponse =
      await this.walletBceAdminService.getTransactionDetail(query)

    /**
     * * Map admin data from admin v3
     */
    const { data: transactionDetail } = transactionDetailResponse

    if (transactionDetail.sendConfirmer1) {
      const sendConfirmer1Data = await this.adminService.getAdminById(
        `${transactionDetail.sendConfirmer1}`,
      )

      transactionDetailResponse.data.sendConfirmer1Data = sendConfirmer1Data
    }

    if (transactionDetail.sendConfirmer2) {
      const sendConfirmer2Data = await this.adminService.getAdminById(
        `${transactionDetail.sendConfirmer2}`,
      )

      transactionDetailResponse.data.sendConfirmer2Data = sendConfirmer2Data
    }

    return transactionDetailResponse
  }

  async downloadFileExport(query: BceDownloadFileExportRequest) {
    const publicUrl = await this.uploadFileService.getPublicUrl(
      query.path,
      undefined,
      query.fileName,
    )

    return ParseResponseGrpcHotWallet(BceDownloadFileExportResponse, {
      data: {
        url: publicUrl,
      },
      message: 'success',
    })
  }

  async getListAdmin() {
    const admin = await this.adminService.getAll()
    return {
      data: plainToInstance(AdminEntityDto, instanceToPlain(admin)),
    }
  }
}
