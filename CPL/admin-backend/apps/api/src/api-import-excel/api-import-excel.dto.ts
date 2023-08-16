import { IsFileTypes } from '@lib/upload-file/validations/decorators/is-file-types'
import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsString, Max } from 'class-validator'
import { BALANCE_TYPE, VALIDATION_ERRORS } from '../api-balance/balance.enum'

export class UploadFileRequest {
  @ApiProperty({ required: true, example: 1 })
  @Expose({ name: 'admin_id' })
  @IsNotEmpty()
  adminId: string
}

export class FileRequest {
  @Expose()
  @IsNotEmpty()
  @Max(5242880)
  size: number

  @Expose()
  @IsNotEmpty()
  @IsFileTypes(['xlsx', 'xls'])
  originalname: string

  @Expose()
  @IsNotEmpty()
  buffer: Buffer
}

export class BasePaginationQuery {
  @Expose()
  @ApiProperty({ required: false, example: 1 })
  page?: number

  @Expose()
  @ApiProperty({ required: false, example: 1 })
  size?: number
}

export class ListBalanceFilesRequest extends BasePaginationQuery {}

export class ConfirmImportBalanceRequest {
  @ApiProperty({ enum: BALANCE_TYPE })
  @Expose()
  @IsEnum(BALANCE_TYPE, { message: VALIDATION_ERRORS.BALANCE_TYPE_IS_ENUM })
  @IsString({ message: VALIDATION_ERRORS.BALANCE_TYPE_IS_ENUM })
  balance_type: string
}
