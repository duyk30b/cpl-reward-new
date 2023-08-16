import { Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common'
import { TokenService } from './token.service'
import { IRequestWithRefreshToken } from '../interfaces/request-with-refresh-token'
import { ConfigService } from '@nestjs/config'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { GrantAccessTokenDto } from './dto/grant-access-token.dto'
import { AdminService } from '@lib/admin'

@ApiTags('token')
@Controller('token')
export class TokenController {
  constructor(
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
    private readonly adminService: AdminService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get new access token with refresh token' })
  @ApiBody({ type: GrantAccessTokenDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get new access token successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Refresh token is invalid.',
  })
  async grantAccessToken(@Req() request: IRequestWithRefreshToken) {
    const newAccessToken = this.tokenService.grantAccessToken(
      request.refreshTokenInfo,
    )

    let admin = await this.adminService.getAdminById(
      request.refreshTokenInfo.uid,
    )
    admin = await this.adminService.getAdminWithPermissionsAndScreens(admin)

    return {
      access_token: newAccessToken,
      expires_in: this.configService.get('access_jwt_exp'),
      user_info: admin,
    }
  }
}
