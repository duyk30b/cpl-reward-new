import { AppVersionService } from '@lib/grpc-client/app-version/app-version.service'
import { AppVersion } from '@lib/grpc-client/app-version/dtos/app-version.dto'
import {
  CreateAppVersionDto,
  DeleteAppVersionDto,
  EditAppVersionDto,
} from '@lib/grpc-client/app-version/dtos/edit-app-version.dto'
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { instanceToPlain } from 'class-transformer'
import { Permission } from '../permissions/permission.data'
import { CheckPermission } from '../permissions/permission.decorator'
import { GetAppVersionParamDto } from './api-app-version.dto'

@ApiTags('App version setting')
@Controller('api-app-version')
export class ApiAppVersionController {
  constructor(private readonly appVersionService: AppVersionService) {}

  @Get(':platform')
  @CheckPermission(Permission.APP_VERSION_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get app version settings' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: [AppVersion] })
  public async getAppVersions(@Param() param: GetAppVersionParamDto) {
    return instanceToPlain(
      await this.appVersionService.getAppVersions(param.platform),
    )
  }

  @Post()
  @CheckPermission(Permission.APP_VERSION_CREATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create an app version setting' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: AppVersion })
  public async createAppVersion(@Body() body: CreateAppVersionDto) {
    return instanceToPlain(await this.appVersionService.saveAppVersion(body))
  }

  @Patch()
  @CheckPermission(Permission.APP_VERSION_UPDATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update an app version setting' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: AppVersion })
  public async updateAppVersion(@Body() body: EditAppVersionDto) {
    return instanceToPlain(await this.appVersionService.saveAppVersion(body))
  }

  @Post('/delete')
  @CheckPermission(Permission.APP_VERSION_DELETE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete an app version setting' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: AppVersion })
  public async deleteAppVersion(@Body() body: DeleteAppVersionDto) {
    return instanceToPlain(await this.appVersionService.deleteAppVersion(body))
  }
}
