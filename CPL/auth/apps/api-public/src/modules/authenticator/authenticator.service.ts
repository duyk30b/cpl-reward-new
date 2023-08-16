import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BusinessException } from '@lib/util'
import { AddAuthenticatorError, DisableAuthenticatorError } from '@lib/util'
import { UserService } from '@lib/user'
import { DisableAuthenticatorDto } from './dto/disable-authenticator.dto'
import { GenerateAuthenticatorInfoDto } from './dto/generate-authenticator-info.dto'
import { VerifyAuthenticatorDto } from './dto/verify-authenticator.dto'
import { AuthenticatorOtpService } from '@lib/otp'

@Injectable()
export class AuthenticatorService {
  emailOtpLength: number
  emailOtpTtl: number

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly authenticatorOtpService: AuthenticatorOtpService,
  ) {
    this.emailOtpTtl = this.configService.get('otp.email.ttl')
    this.emailOtpLength = parseInt(this.configService.get('otp.email.length'))
  }

  async generateAuthenticatorInfo(
    userId: string,
    generateAuthenticatorInfoDto: GenerateAuthenticatorInfoDto,
  ) {
    const user = await this.userService.getUserById(userId)

    if (user.isAuthenticatorVerified) {
      throw new BusinessException(
        AddAuthenticatorError.AUTHENTICATOR_ALREADY_VERIFIED,
      )
    }

    const passwordMatched = await this.userService.checkPasswordWithUserId(
      userId,
      generateAuthenticatorInfoDto.password,
    )

    if (!passwordMatched) {
      throw new BusinessException(AddAuthenticatorError.WRONG_PASSWORD)
    }

    const secret = await this.userService.getOtpSecretByUserId(userId)

    return { secret }
  }

  async verifyAuthenticator(
    userId: string,
    verifyAuthenticatorDto: VerifyAuthenticatorDto,
  ) {
    const user = await this.userService.getUserByIdWithPrivateField(userId)

    if (user.isAuthenticatorVerified) {
      throw new BusinessException(
        AddAuthenticatorError.AUTHENTICATOR_ALREADY_VERIFIED,
      )
    }

    await this.authenticatorOtpService.validateAuthenticatorOtp(
      verifyAuthenticatorDto.otp,
      user,
    )

    await this.userService.setAuthenticatorVerified(user)
  }

  async disableAuthenticator(
    userId: string,
    disableAuthenticatorDto: DisableAuthenticatorDto,
  ) {
    const user = await this.userService.getUserByIdWithPrivateField(userId)

    if (!user.isAuthenticatorVerified) {
      throw new BusinessException(
        DisableAuthenticatorError.AUTHENTICATOR_ALREADY_DISABLED,
      )
    }

    const passwordMatched = await this.userService.checkPasswordWithUserId(
      userId,
      disableAuthenticatorDto.password,
    )

    if (!passwordMatched) {
      throw new BusinessException(DisableAuthenticatorError.WRONG_PASSWORD)
    }

    await this.authenticatorOtpService.validateAuthenticatorOtp(
      disableAuthenticatorDto.otp,
      user,
    )

    await this.userService.disableAuthenticator(user)

    await this.authenticatorOtpService.markUsedAuthenticatorOtp(
      user.id,
      disableAuthenticatorDto.otp,
    )
  }
}
