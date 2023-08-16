import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common'
import {
  ApiOperation,
  ApiHeader,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { DeviceService } from '@lib/device'
import { LogoutAllDto } from 'apps/api-public/src/modules/device/dto/logout-all.dto'
import { ApiCommon } from '../../api-docs/common-headers'
import { IRequestWithAccessToken } from '../../interfaces/request-with-access-token'
import { AuthDeviceService } from './auth-device.service'
import { LogoutDeviceDto } from './dto/logout-device.dto'

@ApiHeader(ApiCommon.device)
@ApiTags('device')
@Controller('device')
export class AuthDeviceController {
  constructor(
    private readonly authDevicesService: AuthDeviceService,
    private readonly devicesService: DeviceService,
  ) {}

  @Get('')
  @ApiOperation({ summary: 'Get current user devices' })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get device successfully',
  })
  async getUserDevices(@Req() request: IRequestWithAccessToken) {
    const devices = await this.authDevicesService.getDevicesByUserId(
      request.accessTokenInfo.userId,
    )
    return devices
  }

  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout from all device' })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Logout successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Missing or wrong password.',
  })
  async logoutAllDevices(
    @Body() logoutAllDto: LogoutAllDto,
    @Req() request: IRequestWithAccessToken,
  ) {
    await this.authDevicesService.logoutAllDevices(
      request.accessTokenInfo.userId,
      request.accessTokenInfo.deviceId,
      logoutAllDto,
    )
    return { success: true }
  }

  @Post(':id/logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout from specific device' })
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'id',
    description: 'Logout device id',
    required: true,
    schema: { type: 'number' },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Logout successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Missing or wrong password.',
  })
  async logoutDevice(
    @Param('id') deviceId,
    @Body() logoutDeviceDto: LogoutDeviceDto,
    @Req() request: IRequestWithAccessToken,
  ) {
    await this.authDevicesService.logoutDevice(
      request.accessTokenInfo.userId,
      deviceId,
      logoutDeviceDto,
    )

    return { success: true }
  }
}
