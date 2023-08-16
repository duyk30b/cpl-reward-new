import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Req,
} from '@nestjs/common'
import { ApiAuthService } from './api-auth.service'
import {
  ApiAuthLoginDto,
  ApiAuthLoginVerifyDto,
  ApiAdminChangePasswordDto,
  GenerateAuthenticatorInfoDto,
} from './dto/api-auth.dto'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { IRequestWithAccessToken } from '../interfaces/request-with-access-token'
import { ConfigService } from '@nestjs/config'

@ApiTags('auth')
@Controller('auth')
export class ApiAuthController {
  constructor(
    private readonly apiAuthService: ApiAuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  @ApiBody({ type: ApiAuthLoginDto })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request body is invalid.',
  })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: ApiAuthLoginDto) {
    return await this.apiAuthService.validateAdmin(loginDto)
  }

  @Post('login-verify')
  @ApiBody({ type: ApiAuthLoginVerifyDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request body is invalid.',
  })
  @HttpCode(HttpStatus.OK)
  async loginVerify(@Body() apiAuthLoginVerifyDto: ApiAuthLoginVerifyDto) {
    const admin = await this.apiAuthService.verifyLogin(apiAuthLoginVerifyDto)
    if (!admin) {
      return null
    }

    const { accessToken, refreshToken } =
      this.apiAuthService.createAdminToken(admin)
    return {
      user_info: admin,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: this.configService.get('access_jwt_exp'),
    }
  }

  @Post('change-password')
  @ApiBody({ type: ApiAdminChangePasswordDto })
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Req() request: IRequestWithAccessToken,
    @Body() changePasswordDto: ApiAdminChangePasswordDto,
  ) {
    return await this.apiAuthService.changePassword(
      request.accessTokenInfo.uid,
      changePasswordDto,
    )
  }

  @Post('/authenticator')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Generate info for authenticator' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Info returned successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Token is invalid or blacklisted.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Password is missing or invalid',
  })
  async generateAuthenticatorInfo(
    @Req() request: IRequestWithAccessToken,
    @Body() generateAuthenticatorInfoDto: GenerateAuthenticatorInfoDto,
  ) {
    return await this.apiAuthService.generateAuthenticatorInfo(
      request.accessTokenInfo.uid.toString(),
      generateAuthenticatorInfoDto,
    )
  }
}
