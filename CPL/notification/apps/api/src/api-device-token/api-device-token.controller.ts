import { KongHeader } from '@libs/auth-kong'
import { IRequestWithToken } from '@libs/util'
import { Body, Controller, Post, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiRegisterTokenDto } from './api-device-token.dto'
import { ApiDeviceTokenService } from './api-device-token.service'

@Controller('device-token')
@ApiTags('device-token')
export class ApiDeviceTokenController {
  constructor(private readonly apiDeviceTokenService: ApiDeviceTokenService) {}

  @Post('register')
  @KongHeader()
  async registerToken(
    @Req() req: IRequestWithToken,
    @Body() registerTokenDto: ApiRegisterTokenDto,
  ) {
    const { userId, deviceId } = req.tokenInfo
    return await this.apiDeviceTokenService.registerToken(
      userId,
      deviceId,
      registerTokenDto,
    )
  }
}
