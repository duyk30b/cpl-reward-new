import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { AccessTokenService, RefreshTokenService } from '@lib/authorization'
import { Admin, AdminService } from '@lib/admin'
import { AuthenticatorOtpService, EOtpBusiness, OtpService } from '@lib/otp'
import {
  AdminResponseDto,
  ApiAuthLoginDto,
  ApiAuthLoginVerifyDto,
  ApiAdminChangePasswordDto,
  GenerateAuthenticatorInfoDto,
  GenerateAuthenticatorInfoResponseDto,
} from './dto/api-auth.dto'
import { BusinessException, currentTime, TokenError } from '@lib/util'
import { AddAuthenticatorError } from '@lib/util/formater/error'
import { plainToClass } from 'class-transformer'
import {
  MailTemplate,
  NotificationService,
} from '@lib/grpc-client/notification'

@Injectable()
export class ApiAuthService {
  constructor(
    private adminService: AdminService,
    private readonly accessTokenService: AccessTokenService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly authenticatorOtpService: AuthenticatorOtpService,
    private readonly otpService: OtpService,
    private readonly notificationService: NotificationService,
  ) {}

  async validateAdmin(loginDto: ApiAuthLoginDto): Promise<AdminResponseDto> {
    const admin = await this.adminService.checkPassword(
      loginDto.email,
      loginDto.password,
    )
    if (!admin) {
      throw new HttpException('Invalid email or password', HttpStatus.NOT_FOUND)
    }

    // validate authenticator step 1
    await this.authenticatorOtpService.validateAuthenticatorOtp(
      loginDto.otp,
      admin,
    )

    // generate token for send to email
    const { token, ttl } = await this.otpService.generateToken(
      admin.id.toString(),
      EOtpBusiness.ADMIN_LOGIN_VERIFY,
    )

    await this.notificationService.sendMail({
      emails: [admin.email],
      data: JSON.stringify({
        code: token,
        email: admin.email,
        name: admin.name || admin.email,
        ttl,
        time: currentTime(),
      }),
      mailCommand: {
        lang: loginDto.lang ? loginDto.lang : 'en',
        template: MailTemplate.ADMIN_LOGIN_VERIFY,
      },
    })

    return plainToClass(AdminResponseDto, admin, {
      excludeExtraneousValues: true,
    })
  }

  async changePassword(
    adminId: string,
    changePasswordDto: ApiAdminChangePasswordDto,
  ) {
    await this.adminService.changePassword(
      adminId,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    )

    return { success: true }
  }

  async verifyLogin(apiAuthLoginVerifyDto: ApiAuthLoginVerifyDto) {
    let admin = await this.adminService.getAdminByEmail(
      apiAuthLoginVerifyDto.email,
    )

    if (!admin) {
      throw new HttpException('Admin not found', HttpStatus.NOT_FOUND)
    }

    // validate token from email
    //if (process.env.ENV != 'local') {
    await this.otpService.validateToken(
      apiAuthLoginVerifyDto.token,
      admin.id.toString(),
      EOtpBusiness.ADMIN_LOGIN_VERIFY,
      new BusinessException(TokenError.INVALID),
    )

    // validate authenticator step 2
    await this.authenticatorOtpService.validateAuthenticatorOtp(
      apiAuthLoginVerifyDto.otp,
      admin,
    )
    //}

    await this.adminService.removeAdminCache(admin.id)

    admin = await this.adminService.getAdminWithPermissionsAndScreens(admin)

    return admin
  }

  async generateAuthenticatorInfo(
    adminId: string,
    generateAuthenticatorInfoDto: GenerateAuthenticatorInfoDto,
  ): Promise<GenerateAuthenticatorInfoResponseDto> {
    const admin = await this.adminService.getAdminByIdWithPrivateField(adminId)
    if (!admin) {
      throw new HttpException('Invalid adminId', HttpStatus.BAD_REQUEST)
    }

    const passwordMatched = await this.adminService.checkPassword(
      admin.email,
      generateAuthenticatorInfoDto.password,
    )

    if (!passwordMatched) {
      throw new BusinessException(AddAuthenticatorError.WRONG_PASSWORD)
    }

    const authenticatorCode = await this.adminService.getOtpSecretByAminId(
      adminId,
    )
    await this.adminService.updateAuthenticator(adminId, authenticatorCode)

    return plainToClass(
      GenerateAuthenticatorInfoResponseDto,
      { secret: authenticatorCode },
      { excludeExtraneousValues: true },
    )
  }

  createAdminToken(admin: Admin) {
    const appId = 1
    const accessTokenPayload = {
      appId: appId,
      scopes: 'all',
      uid: admin.id,
    }

    const accessToken = this.accessTokenService.create(accessTokenPayload)

    const refreshTokenPayload = {
      appId: appId,
      scopes: 'all',
      uid: admin.id,
    }

    const refreshToken = this.refreshTokenService.create(refreshTokenPayload)

    return { accessToken, refreshToken }
  }
}
