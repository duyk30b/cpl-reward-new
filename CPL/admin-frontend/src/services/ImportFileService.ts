import ApiService from '@/core/services/ApiService'
import {
  BalanceImportFileRowsRequest,
  BalanceImportFileDetailResponse,
  BalanceImportFileSettingRequest,
  BalanceImportFileSettingResponse,
  ListBalanceImportFileRequest,
  ListBalanceImportFileResponse,
  UpdateBalanceImportFileSettingRequest,
  UpdateBalanceImportFileSettingResponse,
  BalanceImportFileRowsResponse,
  BalanceImportSummaryResponse,
  ConfirmBalanceImportFileResponse,
  CancelBalanceImportFileResponse,
  ConfirmBalanceImportFileRequest,
} from '@/interfaces/import-file.interface'

export class ImportFileService {
  public static async uploadFileImportBalance(data: FormData, config: any) {
    return ApiService.post(`/import-excel/balance`, data, config)
  }

  public static async getSummary(): Promise<BalanceImportSummaryResponse> {
    return ApiService.get(`/import-excel/balance/summary`)
  }

  public static async getListBalanceImportFiles(
    params: ListBalanceImportFileRequest,
  ): Promise<ListBalanceImportFileResponse> {
    return ApiService.get(`/import-excel/balance/files`, { params })
  }

  public static async getBalanceImportFile(
    fileId: string,
  ): Promise<BalanceImportFileDetailResponse> {
    return ApiService.get(`/import-excel/balance/${fileId}/detail`)
  }

  public static async getBalanceImportFileRows(
    fileId: string,
    params: BalanceImportFileRowsRequest,
  ): Promise<BalanceImportFileRowsResponse> {
    return ApiService.get(`/import-excel/balance/${fileId}/rows`, { params })
  }

  public static async confirmBalanceImportFile(
    fileId: string,
    params: ConfirmBalanceImportFileRequest,
  ): Promise<ConfirmBalanceImportFileResponse> {
    return ApiService.post(`/import-excel/balance/${fileId}/confirm`, params)
  }

  public static async cancelBalanceImportFile(
    fileId: string,
  ): Promise<CancelBalanceImportFileResponse> {
    return ApiService.post(`/import-excel/balance/${fileId}/cancel `, {})
  }

  public static async getBalanceImportFileDownload(
    fileId: string,
    fileName: string,
  ): Promise<BalanceImportFileDetailResponse> {
    return ApiService.getAndDownload(
      `/import-excel/balance/${fileId}/download`,
      {},
      fileName,
    )
  }

  public static async getBalanceImportFileSetting(
    params: BalanceImportFileSettingRequest,
  ): Promise<BalanceImportFileSettingResponse> {
    return ApiService.get(`/import-excel/balance/file/settings`, { params })
  }

  public static async updateBalanceImportFileSetting(
    data: UpdateBalanceImportFileSettingRequest,
  ): Promise<UpdateBalanceImportFileSettingResponse> {
    return ApiService.post(`/import-excel/balance/file/settings`, { ...data })
  }
}
