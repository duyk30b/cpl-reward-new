import { ImportFileService } from '@app/import-file'
import {
  BalanceFileSettingCreateRequest,
  BalanceFileSettingRequest,
} from '@app/import-file/dtos/api-import-excel.dto'
import { IMPORT_FILE_ERRORS } from '@app/import-file/import-file.enum'
import {
  BalanceImportFileErrors,
  BusinessException,
  ValidationException,
} from '@lib/util'
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { Permission } from '../permissions/permission.data'
import { CheckPermission } from '../permissions/permission.decorator'
import {
  BasePaginationQuery,
  ConfirmImportBalanceRequest,
  FileRequest,
  ListBalanceFilesRequest,
  UploadFileRequest,
} from './api-import-excel.dto'
import { UploadFileInfo } from './api-import-excel.interface'

@ApiTags('import-excel')
@Controller('import-excel')
export class ApiImportExcelController {
  constructor(private apiImportExcelService: ImportFileService) {}

  @Post('balance')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.BALANCE_FILE_IMPORT_CREATE)
  async balance(
    @Body() uploadFileRequest: UploadFileRequest,
    @UploadedFile() file: FileRequest,
  ) {
    const info: UploadFileInfo = {
      file: file.buffer,
      file_name: file.originalname,
      admin_id: uploadFileRequest.adminId,
    }

    const importBalance = await this.apiImportExcelService.importBalance(info)
    if (
      !importBalance.status &&
      importBalance.type === IMPORT_FILE_ERRORS.AMOUNT_ERROR
    ) {
      throw new BusinessException(BalanceImportFileErrors.MAX_FILE_AMOUNT)
    }

    if (
      !importBalance.status &&
      importBalance.type === IMPORT_FILE_ERRORS.INVALID_FILE_FORMAT
    ) {
      throw new ValidationException(importBalance.data)
    }

    return importBalance
  }

  @Get('balance/summary')
  @CheckPermission(Permission.BALANCE_FILE_IMPORT_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get list file import balance' })
  @HttpCode(HttpStatus.OK)
  async summary() {
    return this.apiImportExcelService.getSummary()
  }

  @Get('balance/files')
  @CheckPermission(Permission.BALANCE_FILE_IMPORT_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get list file import balance' })
  @HttpCode(HttpStatus.OK)
  async getFiles(@Query() listBalanceFileRequest: ListBalanceFilesRequest) {
    return this.apiImportExcelService.getListBalanceFiles(
      listBalanceFileRequest,
    )
  }

  @Get('balance/:fileId/detail')
  @CheckPermission(Permission.BALANCE_FILE_IMPORT_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get import balance file detail' })
  @HttpCode(HttpStatus.OK)
  async getFileDetail(@Param('fileId') fileId: string) {
    return this.apiImportExcelService.getFile(fileId)
  }

  @Post('balance/:fileId/confirm')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.BALANCE_FILE_IMPORT_CREATE)
  async confirmImport(
    @Param('fileId') fileId: string,
    @Body() request: ConfirmImportBalanceRequest,
  ) {
    return await this.apiImportExcelService.confirmImportBalance(
      fileId,
      request,
    )
  }

  @Post('balance/:fileId/cancel')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.BALANCE_FILE_IMPORT_CREATE)
  async cancelImport(@Param('fileId') fileId: string) {
    return await this.apiImportExcelService.cancelImportBalance(fileId)
  }

  @Get('balance/:fileId/rows')
  @CheckPermission(Permission.BALANCE_FILE_IMPORT_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get import balance file detail' })
  @HttpCode(HttpStatus.OK)
  async getFileRows(
    @Param('fileId') fileId: string,
    @Query() query: BasePaginationQuery,
  ) {
    return this.apiImportExcelService.getFileRows(fileId, query)
  }

  @Get('balance/:fileId/download')
  @CheckPermission(Permission.BALANCE_FILE_IMPORT_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get import balance file download' })
  @HttpCode(HttpStatus.OK)
  async getFileDownload(@Param('fileId') fileId: string, @Res() res: Response) {
    const buf = await this.apiImportExcelService.getDownloadBalanceFile(fileId)
    res.header('Content-Type', 'application/vnd.ms-excel')
    res.end(buf)
  }

  @Post('balance/file/settings')
  @CheckPermission(Permission.BALANCE_FILE_SETTING_CREATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update or Create file balance settings' })
  @HttpCode(HttpStatus.OK)
  async updateOrCreateSetting(
    @Body() balanceFileSettingRequest: BalanceFileSettingCreateRequest,
  ) {
    return this.apiImportExcelService.updateOrCreateSetting(
      balanceFileSettingRequest,
    )
  }

  @Get('balance/file/settings')
  @CheckPermission(Permission.BALANCE_FILE_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get file balance settings' })
  @HttpCode(HttpStatus.OK)
  async getFileSettings(
    @Query() balanceFileSettingRequest: BalanceFileSettingRequest,
  ) {
    return this.apiImportExcelService.getListSettings(balanceFileSettingRequest)
  }
}
