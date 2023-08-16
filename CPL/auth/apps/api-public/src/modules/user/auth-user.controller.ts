import { UserService } from '@lib/user'
import { Lang } from '@lib/util/decorators/param.decorator'
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { ApiCommon } from 'apps/api-public/src/api-docs/common-headers'
import { ChangePasswordDto } from 'apps/api-public/src/modules/user/dto/change-password.dto'
import { Request } from 'express'
import { getClientIp } from 'request-ip'
import { IRequestWithAccessToken } from '../../interfaces/request-with-access-token'
import { AddEmailAuthenticationDto } from './dto/add-email-authentication.dto'
import { AuthLoginDto } from './dto/auth-login.dto'
import { AuthRegisterDto } from './dto/auth-register.dto'
import { ChangeEmailDto } from './dto/change-email.dto'
import { CheckEmailExistDto } from './dto/check-email-exist.dto'
import { DeleteAccountDto } from './dto/delete-account.dto'
import { FirebaseDto } from './dto/firebase.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { SendChangeEmailOtpDto } from './dto/send-change-email-otp.dto'
import { SendDeviceVerificationOtpDto } from './dto/send-device-verification-otp.dto'
import { SendForgotPasswordOtpDto } from './dto/send-forgot-password-otp.dto'
import { SendVerifyEmailDto } from './dto/send-verify-email.dto'
import { UpdateTutorialStatusDto } from './dto/update-tutorial-status.dto'
import { AuthLoginService } from './services/auth-login.service'
import { AuthLogoutService } from './services/auth-logout.service'
import { AuthRegisterService } from './services/auth-register.service'
import { AuthUserService } from './services/auth-user.service'
import { ChangePasswordService } from './services/change-password.service'
import { ForgotPasswordService } from './services/forgot-password.service'
import { SocialService } from './services/social.service'
import { VerifyAccountService } from './services/verify-account.service'

@ApiHeader(ApiCommon.device)
@ApiTags('user')
@Controller('user')
export class AuthUserController {
  constructor(
    private readonly registerService: AuthRegisterService,
    private readonly authLogoutService: AuthLogoutService,
    private readonly authLoginService: AuthLoginService,
    private readonly userService: UserService,
    private readonly changePasswordService: ChangePasswordService,
    private readonly verifyAccountService: VerifyAccountService,
    private readonly forgotPasswordService: ForgotPasswordService,
    private readonly socialService: SocialService,
    private readonly authUserService: AuthUserService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiHeader(ApiCommon.recaptcha)
  @ApiHeader(ApiCommon.recaptcha_type)
  @ApiQuery(ApiCommon.lang)
  async register(
    @Body() registerDto: AuthRegisterDto,
    @Req() request: Request,
    @Lang() lang,
  ) {
    const deviceInfo = request.header('device')
    const deviceHash = request.header('device_hash')

    const { user, device } = await this.registerService.create(
      registerDto,
      deviceInfo,
      deviceHash,
      getClientIp(request),
      lang,
    )

    const { accessToken, refreshToken } = this.authUserService.createUserToken(
      user,
      device,
    )

    return {
      user: user,
      access_token: accessToken,
      refresh_token: refreshToken,
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login' })
  @ApiHeader(ApiCommon.recaptcha)
  @ApiHeader(ApiCommon.recaptcha_type)
  @ApiBody({ type: AuthLoginDto })
  @ApiQuery(ApiCommon.lang)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request body is invalid.',
  })
  async login(
    @Body() createLoginDto: AuthLoginDto,
    @Req() request: Request,
    @Lang() lang,
  ) {
    const deviceInfo = request.header('device')
    const deviceHash = request.header('device_hash')
    const { user, device } = await this.authLoginService.login(
      createLoginDto,
      deviceInfo,
      deviceHash,
      getClientIp(request),
      lang,
    )

    const { accessToken, refreshToken } = this.authUserService.createUserToken(
      user,
      device,
    )

    const userData = await this.authUserService.aggregateUserInfoForLogin(user)

    return {
      user: userData,
      access_token: accessToken,
      refresh_token: refreshToken,
    }
  }

  @Post('send-device-verification-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send device verification OTP' })
  @ApiQuery(ApiCommon.lang)
  @ApiHeader(ApiCommon.recaptcha)
  @ApiHeader(ApiCommon.recaptcha_type)
  @ApiBody({ type: SendDeviceVerificationOtpDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Device verification sent successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request',
  })
  async sendDeviceVerificationOtp(
    @Body() sendDeviceVerificationOtpDto: SendDeviceVerificationOtpDto,
    @Req() request: Request,
    @Lang() lang,
  ) {
    const deviceInfo = request.header('device')
    return await this.authLoginService.sendDeviceVerificationOtp(
      sendDeviceVerificationOtpDto,
      deviceInfo,
      getClientIp(request),
      lang,
    )
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout' })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Logout successfully',
  })
  async logout(@Req() request: IRequestWithAccessToken) {
    await this.authLogoutService.logout(
      request.accessTokenInfo.userId,
      request.accessTokenInfo.deviceId,
    )

    return { success: true }
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change user password' })
  @ApiBearerAuth('access-token')
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Change password successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Missing parameter or old password does not match or new password is the same as old password.',
  })
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() request: IRequestWithAccessToken,
  ) {
    await this.changePasswordService.changePassword(
      request.accessTokenInfo.userId,
      changePasswordDto,
    )
    return { success: true }
  }

  @Post('send-verification-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend verify code to email' })
  @ApiQuery(ApiCommon.lang)
  @ApiHeader(ApiCommon.recaptcha)
  @ApiHeader(ApiCommon.recaptcha_type)
  @ApiBody({ type: SendVerifyEmailDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Verify email sent successfully',
  })
  async sendVerifyEmail(
    @Body() sendVerifyEmailDto: SendVerifyEmailDto,
    @Req() request: Request,
    @Lang() lang,
  ) {
    return await this.verifyAccountService.sendVerifyEmail(
      sendVerifyEmailDto,
      lang,
    )
  }

  @Post('send-add-email-otp')
  @HttpCode(HttpStatus.OK)
  @ApiQuery(ApiCommon.lang)
  @ApiBearerAuth('access-token')
  @ApiHeader(ApiCommon.recaptcha)
  @ApiHeader(ApiCommon.recaptcha_type)
  @ApiBody({ type: SendVerifyEmailDto })
  async sendAddEmailOtp(
    @Body() sendVerifyEmailDto: SendVerifyEmailDto,
    @Req() req: IRequestWithAccessToken,
    @Lang() lang,
  ) {
    return await this.verifyAccountService.sendAddEmailOtp(
      sendVerifyEmailDto,
      req.accessTokenInfo.userId,
      lang,
    )
  }

  @Post('send-forgot-password-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send forgot password OTP' })
  @ApiQuery(ApiCommon.lang)
  @ApiBody({ type: SendForgotPasswordOtpDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Forgot password otp sent successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request',
  })
  @ApiHeader(ApiCommon.recaptcha)
  @ApiHeader(ApiCommon.recaptcha_type)
  async sendForgotPasswordOtp(
    @Body() sendForgotPasswordOtpDto: SendForgotPasswordOtpDto,
    @Lang() lang,
  ) {
    return await this.forgotPasswordService.sendForgotPasswordOtp(
      sendForgotPasswordOtpDto,
      lang,
    )
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reset password with OTP code what sent to email or phone before',
  })
  @ApiHeader(ApiCommon.recaptcha)
  @ApiHeader(ApiCommon.recaptcha_type)
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reset password successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request',
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.forgotPasswordService.resetPassword(resetPasswordDto)
    return { success: true }
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user info' })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get info successfully',
  })
  async getCurrentUser(@Req() request: IRequestWithAccessToken) {
    return await this.authUserService.getCurrentUser(
      request.accessTokenInfo.userId,
    )
  }

  @Post('check-email-exist')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check if email registered or not' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Checking is completed. Result returned in response',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Email is not valid',
  })
  async checkEmailExist(@Body() checkEmailExistDto: CheckEmailExistDto) {
    return await this.userService.checkEmailExist(checkEmailExistDto.email)
  }

  @Post('check-email-exist-for-logged-in-user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check if email registered or not' })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Checking is completed. Result returned in response',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Email is not valid',
  })
  async checkEmailExistForLoggedInUser(
    @Body() checkEmailExistDto: CheckEmailExistDto,
    @Req() request: IRequestWithAccessToken,
  ) {
    return await this.userService.checkEmailExist(
      checkEmailExistDto.email,
      request.accessTokenInfo.userId,
    )
  }

  @Patch('add-email-authentication')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Add email authentication to user account if no email attached',
  })
  @ApiBearerAuth('access-token')
  @ApiHeader(ApiCommon.recaptcha)
  @ApiHeader(ApiCommon.recaptcha_type)
  @ApiBody({ type: AddEmailAuthenticationDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Add email authentication successfully',
  })
  async addEmailAuthentication(
    @Body() addEmailAuthenticationDto: AddEmailAuthenticationDto,
    @Req() request: IRequestWithAccessToken,
  ) {
    return await this.authUserService.addEmailAuthentication(
      request.accessTokenInfo.userId,
      addEmailAuthenticationDto,
    )
  }

  @Post('firebase')
  @HttpCode(HttpStatus.OK)
  @ApiQuery(ApiCommon.lang)
  @ApiOperation({
    summary: 'Login or register with firebase (OTP, Facebook, Google)',
  })
  @ApiHeader(ApiCommon.recaptcha)
  @ApiHeader(ApiCommon.recaptcha_type)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login/register via firebase successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request is not valid',
  })
  async firebase(
    @Body() firebaseDto: FirebaseDto,
    @Req() request: Request,
    @Lang() lang,
  ) {
    const deviceInfo = request.header('device')
    const deviceHash = request.header('device_hash')
    const { user, device } = await this.socialService.firebase(
      firebaseDto,
      deviceInfo,
      deviceHash,
      getClientIp(request),
      lang,
    )

    const { accessToken, refreshToken } = this.authUserService.createUserToken(
      user,
      device,
    )

    const userData = await this.authUserService.aggregateUserInfoForLogin(user)

    return {
      user: userData,
      access_token: accessToken,
      refresh_token: refreshToken,
    }
  }

  // @Post('change-email/send-current-email-otp')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Send otp to current email' })
  // @ApiBearerAuth('access-token')
  // @ApiQuery(ApiCommon.lang)
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Email sent successfully',
  // })
  // async sendChangeEmailOtpToCurrentEmail(
  //   @Req() request: IRequestWithAccessToken,
  //   @Lang() lang,
  // ) {
  //   return await this.authUserService.sendChangeEmailOtpToCurrentEmail(
  //     request.accessTokenInfo.userId,
  //     lang,
  //   )
  // }

  @Post('change-email/send-new-email-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send otp to new email' })
  @ApiBearerAuth('access-token')
  @ApiQuery(ApiCommon.lang)
  @ApiHeader(ApiCommon.recaptcha)
  @ApiHeader(ApiCommon.recaptcha_type)
  @ApiBody({ type: SendChangeEmailOtpDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Email sent successfully',
  })
  async sendChangeEmailOtpToNewEmail(
    @Body() sendChangeEmailOtpDto: SendChangeEmailOtpDto,
    @Req() request: IRequestWithAccessToken,
    @Lang() lang,
  ) {
    return await this.authUserService.sendChangeEmailOtpToNewEmail(
      request.accessTokenInfo.userId,
      sendChangeEmailOtpDto,
      lang,
    )
  }

  @Patch('change-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change email of user' })
  @ApiBearerAuth('access-token')
  @ApiBody({ type: ChangeEmailDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Change email successfully',
  })
  @ApiHeader(ApiCommon.recaptcha)
  @ApiHeader(ApiCommon.recaptcha_type)
  async changeEmail(
    @Body() changeEmailDto: ChangeEmailDto,
    @Req() request: IRequestWithAccessToken,
  ) {
    await this.authUserService.changeEmail(
      request.accessTokenInfo.userId,
      changeEmailDto,
    )
    return { success: true }
  }

  @Get('referral')
  @ApiOperation({ summary: 'Get referral information of current user' })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get referral info of current user successfully',
  })
  async getReferral(@Req() request: IRequestWithAccessToken) {
    return await this.authUserService.getReferral(
      request.accessTokenInfo.userId,
    )
  }

  @Post('tutorial-status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update tutorial status' })
  @ApiBearerAuth('access-token')
  async updateTutorialStatus(
    @Req() request: IRequestWithAccessToken,
    @Body() updateTutorialStatusDto: UpdateTutorialStatusDto,
  ) {
    await this.authUserService.updateTutorialStatus(
      request.accessTokenInfo.userId,
      updateTutorialStatusDto.type,
      updateTutorialStatusDto.status,
    )
    return { success: true }
  }

  @Post('delete-account')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete Account' })
  @ApiBearerAuth('access-token')
  async deleteAccount(
    @Req() request: IRequestWithAccessToken,
    @Body() deleteAccountDto: DeleteAccountDto,
  ) {
    await this.authUserService.deleteAccount(
      request.accessTokenInfo.userId,
      deleteAccountDto,
    )

    return { success: true }
  }
}
