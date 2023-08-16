import { Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common'
import { TokenService } from './token.service'
import { IRequestWithRefreshToken } from '../../interfaces/request-with-refresh-token'
import { ConfigService } from '@nestjs/config'
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { ApiCommon } from 'apps/api-public/src/api-docs/common-headers'
import { GrantAccessTokenDto } from './dto/grant-access-token.dto'

@ApiHeader(ApiCommon.device)
@ApiTags('token')
@Controller('token')
export class TokenController {
  constructor(
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get new access token with refresh token' })
  @ApiBody({ type: GrantAccessTokenDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get new access token successfully',
  })
  grantAccessToken(@Req() request: IRequestWithRefreshToken) {
    const newAccessToken = this.tokenService.grantAccessToken(
      request.refreshTokenInfo,
    )

    return {
      access_token: newAccessToken,
      expires_in: this.configService.get('access_jwt_exp'),
    }
  }
}
