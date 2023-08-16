import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common'
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger'
import { Permission } from '../permissions/permission.data'
import { CheckPermission } from '../permissions/permission.decorator'
import { UpdateUserInfoDto } from './api-user-info.dto'
import { ApiUserInfoService } from './api-user-info.service'

@ApiTags('user-info')
@Controller('user-info')
export class ApiUserInfoController {
  constructor(private readonly apiUserInfoService: ApiUserInfoService) {}

  @Get('/detail')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_INFO_READ)
  @ApiQuery({ name: 'user_id', required: true })
  async findUserInfoByUserId(@Query('user_id') userId: string) {
    return await this.apiUserInfoService.findUserInfoByUserId(userId)
  }

  @ApiQuery({ name: 'user_id', required: true })
  @ApiBearerAuth('access-token')
  @Get('/history')
  @CheckPermission(Permission.USER_INFO_READ_HISTORY)
  async getListUserInfoHistory(@Query('user_id') userId: string) {
    return await this.apiUserInfoService.getListUserInfoHistory(userId)
  }

  @Post('/:user_id')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_INFO_UPDATE)
  @HttpCode(HttpStatus.OK)
  async updateUserInfo(
    @Body() updateInfoDto: UpdateUserInfoDto,
    @Param('user_id') userId: string,
  ) {
    return await this.apiUserInfoService.updateUserInfo(userId, updateInfoDto)
  }
}
