import { HttpCode, Post } from '@nestjs/common'
import { Body, Controller, HttpStatus, Req } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { ApiCommon } from '../../api-docs/common-headers'
import { IRequestWithAccessToken } from '../../interfaces/request-with-access-token'
import { AuthenticatorService } from './authenticator.service'
import { DisableAuthenticatorDto } from './dto/disable-authenticator.dto'
import { GenerateAuthenticatorInfoDto } from './dto/generate-authenticator-info.dto'
import { VerifyAuthenticatorDto } from './dto/verify-authenticator.dto'

@ApiHeader(ApiCommon.device)
@ApiTags('authenticator')
@Controller('authenticator')
export class AuthenticatorController {
  constructor(private readonly authenticatorService: AuthenticatorService) {}

  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Generate info for authenticator' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Info returned successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Password is missing or invalid',
  })
  async generateAuthenticatorInfo(
    @Req() request: IRequestWithAccessToken,
    @Body() generateAuthenticatorInfoDto: GenerateAuthenticatorInfoDto,
  ) {
    return await this.authenticatorService.generateAuthenticatorInfo(
      request.accessTokenInfo.userId,
      generateAuthenticatorInfoDto,
    )
  }

  @Post('verify')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Verify authenticator' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Verify authenticator successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'OTP is missing or invalid',
  })
  async verifyAuthenticator(
    @Req() request: IRequestWithAccessToken,
    @Body() verifyAuthenticatorDto: VerifyAuthenticatorDto,
  ) {
    await this.authenticatorService.verifyAuthenticator(
      request.accessTokenInfo.userId,
      verifyAuthenticatorDto,
    )
    return { success: true }
  }

  @Post('disable')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Disable authenticator' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Disable authenticator successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Password, OTP is missing or invalid',
  })
  async disableAuthenticator(
    @Req() request: IRequestWithAccessToken,
    @Body() disableAuthenticatorDto: DisableAuthenticatorDto,
  ) {
    await this.authenticatorService.disableAuthenticator(
      request.accessTokenInfo.userId,
      disableAuthenticatorDto,
    )
    return { success: true }
  }
}
