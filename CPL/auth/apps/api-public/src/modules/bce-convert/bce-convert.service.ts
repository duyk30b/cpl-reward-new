import { Injectable } from '@nestjs/common'
import { ConsoleService } from 'nestjs-console'
import { ConfigService } from '@nestjs/config'
import { InjectConnection, InjectRepository } from '@nestjs/typeorm'
import { BceUser } from './bce-user.entity'
import { Connection, Repository } from 'typeorm'
import { BceUserSecuritySetting } from './bce-user-security-setting.entity'
import { HttpService } from '@nestjs/axios'
import { plainToClass } from 'class-transformer'
import { v4 as uuid } from 'uuid'
import parsePhoneNumber from 'libphonenumber-js'
import { map } from 'rxjs'
import { User } from '@lib/user/entities/user.entity'
import { BlacklistUser } from '@lib/blacklist/entities/blacklist-user.entity'
import { encryptOtpSecret } from '@lib/util'
import {
  AcceptLawStatus,
  UserAuthenticatorVerifyStatus,
  UserEmailVerifyStatus,
  UserPasswordEncryptor,
  UserStatus,
  UserType,
} from '@lib/user/enum/user.enum'
import { generateAuthenticatorSecret } from '@lib/otp'

@Injectable()
export class BceConvertService {
  constructor(
    private readonly consoleService: ConsoleService,
    private readonly configService: ConfigService,
    @InjectRepository(BceUser, 'bce')
    private bceUserRepository: Repository<BceUser>,

    @InjectRepository(BceUserSecuritySetting, 'bce')
    private bceUserSecuritySettingRepository: Repository<BceUserSecuritySetting>,

    @InjectRepository(User, 'auth')
    private authUserRepository: Repository<User>,

    @InjectRepository(BlacklistUser, 'auth')
    private blacklistUserRepository: Repository<BlacklistUser>,

    @InjectConnection('auth')
    private connection: Connection,

    private httpService: HttpService,
  ) {
    // get the root cli
    const cli = this.consoleService.getCli()

    // create a single command (See [npm commander arguments/options for more details])
    this.consoleService.createCommand(
      {
        command: 'run',
        description: 'Convert BCE users to auth users',
      },
      this.run,
      cli, // attach the command to the cli
    )
  }

  run = async (): Promise<void> => {
    //await this.main(5000, 1)
    const count = await this.bceUserRepository.count()
    const numberOfPage = Math.round(count / 5000) + 1

    const pages = []
    for (let i = 0; i < numberOfPage; i++) {
      pages.push(this.main(5000, i))
    }
    await Promise.all(pages)
  }

  async main(perpage: number, page: number) {
    const bceUsers = await this.getBceUsers(perpage, page)
    let lastSavedUpdatedAt = -1
    for (const bceUser of bceUsers) {
      // eslint-disable-next-line no-console
      console.log('----\n Converting user: ' + bceUser.id)
      const newUser = plainToClass(User, bceUser, {
        excludeExtraneousValues: true,
      })
      newUser.id = bceUser.id
      newUser.name = bceUser.name
      newUser.uuid = uuid()
      newUser.password = bceUser.password
      newUser.passwordEncryptor = UserPasswordEncryptor.BCE
      newUser.salt = uuid().substr(0, 5)
      newUser.referrerCode = newUser.uuid.replace('-', '').substr(0, 6)
      newUser.referredById = bceUser.referrer_id
      newUser.createdAt = new Date(bceUser.created_at).getTime()
      newUser.updatedAt = new Date(bceUser.updated_at).getTime()
      newUser.bceUpdatedAt = new Date(bceUser.updated_at).getTime()
      newUser.status =
        bceUser.status == 'active' ? UserStatus.ACTIVE : UserStatus.INACTIVE
      newUser.type = bceUser.type == 'normal' ? UserType.NORMAL : UserType.BOT

      // Facebook email
      if (bceUser.facebook_id) {
        newUser.fbId = bceUser.email.slice(3)
      }

      // Xóa kí tự thừa ở các field fb, gg, email
      // if (
      //   newUser.email &&
      //   (newUser.email.startsWith('fb-') || newUser.email.startsWith('gg-'))
      // ) {
      //   newUser.email = newUser.email.slice(3)
      // }
      // if (
      //   newUser.fbId &&
      //   (newUser.fbId.startsWith('fb-') || newUser.fbId.startsWith('gg-'))
      // ) {
      //   newUser.fbId = newUser.fbId.slice(3)
      // }
      // if (
      //   newUser.ggId &&
      //   (newUser.ggId.startsWith('fb-') || newUser.ggId.startsWith('gg-'))
      // ) {
      //   newUser.ggId = newUser.ggId.slice(3)
      // }

      // Mot so BOT ko co created_at, updated_at
      if (!newUser.createdAt) {
        newUser.createdAt = 1
      }
      if (!newUser.updatedAt) {
        newUser.updatedAt = 1
      }
      if (!newUser.bceUpdatedAt) {
        newUser.bceUpdatedAt = 1
      }

      // OTP secret
      newUser.otpSecret = await encryptOtpSecret(generateAuthenticatorSecret())

      // Security setting
      const bceUserSecuritySetting =
        await this.bceUserSecuritySettingRepository.findOne(bceUser.id)
      if (bceUserSecuritySetting) {
        // Email verify
        if (bceUserSecuritySetting.email_verified) {
          newUser.emailVerifyAt = bceUserSecuritySetting.confirm_email_at
          newUser.emailVerifyStatus = UserEmailVerifyStatus.VERIFIED
        }

        // Phone verify
        if (
          bceUserSecuritySetting.phone_verified &&
          bceUserSecuritySetting.phone_verification_code
        ) {
          // Verify phone number time
          newUser.phoneVerifyAt = new Date(
            bceUserSecuritySetting.verify_otp_phone_at,
          ).getTime()

          // Phone country and phone number
          const phoneObject = parsePhoneNumber(
            bceUserSecuritySetting.phone_verification_code,
          )
          if (phoneObject) {
            newUser.phone = phoneObject.nationalNumber.toString()
            newUser.phoneCountry = phoneObject.countryCallingCode.toString()
          }
        }

        if (bceUserSecuritySetting.otp_verified) {
          // Authenticator
          const start = new Date().getTime()
          // console.log('-- Decoding...')
          const authenticatorDecode = await this.decodeAuthenticationCode(
            bceUser.google_authentication,
          )
          const stop = new Date().getTime()
          //console.log('----Decoded after ' + (stop - start) + 'ms')

          newUser.otpSecret = await encryptOtpSecret(authenticatorDecode)
          newUser.authenticatorVerifyAt =
            bceUserSecuritySetting.google_auth_enabled_at
          newUser.authenticatorVerifyStatus =
            UserAuthenticatorVerifyStatus.VERIFIED
        }

        // kyc status, info status sẽ đc chạy bên Laravel

        // accept law
        newUser.acceptLawStatus = AcceptLawStatus.ACCEPTED
      }

      // Insert or update
      const existingUser = await this.authUserRepository.findOne(bceUser.id)
      if (!existingUser) {
        try {
          const createdUser = await this.authUserRepository.save(newUser)
          if (bceUser.updated_at == null) {
            lastSavedUpdatedAt = 0
          } else {
            lastSavedUpdatedAt = bceUser.updated_at.getTime()
          }
          // Nếu user bị ban
          if (bceUser.is_banned) {
            const blacklistUser = new BlacklistUser()
            blacklistUser.userId = createdUser.id
            blacklistUser.note = 'Banned by BCE'
            if (bceUser.updated_at) {
              blacklistUser.createdAt = new Date(bceUser.updated_at).getTime()
            }
            await this.blacklistUserRepository.save(blacklistUser)
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log('Loi khi insert new user ' + e)
        }
      } else {
        //await this.authUserRepository.update({ id: existingUser.id }, newUser)
      }
    }

    // eslint-disable-next-line no-console
    console.log('End block, continue from timestamp: ', lastSavedUpdatedAt)
    return lastSavedUpdatedAt
  }

  async getBceUsers(perpage: number, page: number) {
    return await this.bceUserRepository.find({
      order: { id: 'DESC' },
      skip: perpage * page,
      take: perpage,
    })
  }

  async decodeAuthenticationCode(code: string) {
    for (let i = 0; i < 5; i++) {
      try {
        const result = await this.httpService
          .post(
            this.configService.get('decoder_url'),
            JSON.stringify({
              secret: 'GHVTHV1',
              encrypted: code,
            }),
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )
          .pipe(map((response) => response.data))
          .toPromise()

        if (result) {
          if (result.success) {
            return result.decode.toUpperCase()
          } else {
            return null
          }
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
      }
    }

    return null
  }
}
