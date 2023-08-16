import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { ApiCommon } from '../../api-docs/common-headers'
import { AuthUserInfoDto } from './dto/auth-user-info.dto'
import { AuthUserInfoService } from './auth-user-info.service'
import { IRequestWithAccessToken } from '../../interfaces/request-with-access-token'

@ApiHeader(ApiCommon.device)
@ApiTags('user-info')
@Controller('user-info')
export class AuthUserInfoController {
  constructor(private readonly authUserInfoService: AuthUserInfoService) {}

  @Post('')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Register user info' })
  @ApiBody({ type: AuthUserInfoDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Register successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request body is invalid.',
  })
  async registerUserInfo(
    @Body() authUserInfoDto: AuthUserInfoDto,
    @Req() request: IRequestWithAccessToken,
  ) {
    return await this.authUserInfoService.registerUserInfo(
      request.accessTokenInfo.userId,
      authUserInfoDto,
    )
  }

  @Get('')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get user info' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get info successfully',
  })
  async getUserInfo(@Req() request: IRequestWithAccessToken) {
    return await this.authUserInfoService.getUserInfo(
      request.accessTokenInfo.userId,
    )
  }

  @Post('accept-law')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'User accept law' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Accept law successfully',
  })
  async acceptLaw(@Req() request: IRequestWithAccessToken) {
    await this.authUserInfoService.acceptLaw(request.accessTokenInfo.userId)
    return { success: true }
  }
}
