import { ChannelService } from '@lib/channel'
import { DeviceMapService } from '@lib/device'
import { DynamicLinkService } from '@lib/dynamic-link'
import { generateAuthenticatorSecret } from '@lib/otp'
import { RedisService } from '@lib/redis'
import {
  IUserChangeLvEvent,
  IUserDeleteAccountEvent,
  IUserKycStatusUpdatedEvent,
  RedisQueueService,
} from '@lib/redis-queue'
import { UserEmailService } from '@lib/user-email'
import { UserTagService } from '@lib/user-tag'
import {
  BusinessException,
  compareCaseInsensitive,
  decryptOtpSecret,
  EmailExistError,
  encryptBcePassword,
  encryptOtpSecret,
  encryptUserPassword,
  escapeLikeChars,
  FirebaseError,
  formatInfoToDelete,
  formatPaginate,
  getUserLogoutKey,
  randomString,
  RegisterError,
  sleep,
} from '@lib/util'
import { HttpService } from '@nestjs/axios'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { AddEmailAuthenticationDto } from 'apps/api-public/src/modules/user/dto/add-email-authentication.dto'
import { classToPlain } from 'class-transformer'
import parsePhoneNumber from 'libphonenumber-js'
import { ErrorSyncUserService } from 'libs/error-sync-user/src'
import {
  IPaginationOptions,
  paginate,
  Pagination,
  PaginationTypeEnum,
} from 'nestjs-typeorm-paginate'
import { lastValueFrom } from 'rxjs'
import {
  Brackets,
  FindConditions,
  In,
  LessThan,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm'
import { v4 as uuidv4 } from 'uuid'
import { ICreateUserDto } from '../dto/create-user.dto'
import { ListDividendUserDto } from '../dto/list-dividend-user.dto'
import { LoginDto } from '../dto/login.dto'
import { User } from '../entities/user.entity'
import {
  AcceptLawStatus,
  UserAuthenticatorVerifyStatus,
  UserEmailVerifyStatus,
  UserInfoStatus,
  UserKycVerifyStatus,
  UserPasswordEncryptor,
  UserStatus,
  UserType,
} from '../enum/user.enum'
import {
  ICountReferralFiler,
  ICreateBotDto,
  IUserFilter,
} from '../interfaces/user.interface'

@Injectable()
export class UserService {
  readonly logger = new Logger(UserService.name)
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly deviceMapService: DeviceMapService,
    private readonly redisService: RedisService,
    private readonly httpService: HttpService,
    private readonly channelService: ChannelService,
    private readonly userTagService: UserTagService,
    private readonly errorSyncUserService: ErrorSyncUserService,
    private readonly userEmailService: UserEmailService,
    private readonly dynamicLinkService: DynamicLinkService,
    private readonly redisQueueService: RedisQueueService,
  ) {}

  async getUserById(userId: string) {
    let user = await this.userRepository.findOne({ id: userId })
    if (!user) {
      return user
    }

    if (!user.dynamicLink) {
      const generateLink = await this.dynamicLinkService.generateDynamicLink({
        link: '?ref=' + user.referrerCode,
      })
      if (generateLink.result) {
        user.dynamicLink = generateLink.data.shortLink
      }
      user = await this.userRepository.save(user)
    }

    return user
  }

  async getUserByIds(userIds: string[]) {
    return await this.userRepository.find({
      id: In(userIds),
    })
  }

  async getUserByEmails(emails: string[]) {
    return await this.userRepository.find({
      email: In(emails),
    })
  }

  async getUserByFbId(fbEmail: number) {
    return await this.userRepository.findOne({ where: { fbId: fbEmail } })
  }

  async getUserByGgId(ggEmail: number) {
    return await this.userRepository.findOne({ where: { ggId: ggEmail } })
  }

  async getUserByAppleId(appleEmail: number) {
    return await this.userRepository.findOne({ where: { appleId: appleEmail } })
  }

  async getUserByPhone(phoneCountry: string, phoneNumber: string) {
    return await this.userRepository.findOne({
      phoneCountry,
      phone: phoneNumber,
    })
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({ email: email })
  }

  async getUserByEmailWithPrivateField(email: string) {
    return await this.userRepository
      .createQueryBuilder('user')
      .where({ email: email })
      .addSelect(['user.password', 'user.salt', 'user.otpSecret'])
      .getOne()
  }

  async create(createUserDto: ICreateUserDto) {
    const socialMode =
      createUserDto.ggId || createUserDto.fbId || createUserDto.appleId

    const newUser = new User()
    const salt = randomString(5)
    newUser.salt = salt
    newUser.uuid = uuidv4()
    newUser.otpSecret = await encryptOtpSecret(
      createUserDto.otpSecret || generateAuthenticatorSecret(),
    )
    newUser.lastLogin = new Date().getTime()
    let existRefererCodeUser = null
    do {
      newUser.referrerCode = randomString()
      existRefererCodeUser = await this.getUserByReferrerCode(
        newUser.referrerCode,
      )
    } while (existRefererCodeUser)

    if (socialMode) {
      newUser.ggId = createUserDto.ggId
      newUser.fbId = createUserDto.fbId
      newUser.appleId = createUserDto.appleId
      newUser.checkpoint = JSON.stringify([1]) // Check point 1 to warning user should verify email instead of using social account
      newUser.accountLv = 1
    } else {
      // Require email or phone
      if (!createUserDto.email && !createUserDto.phone) {
        throw new BusinessException(RegisterError.MISSING_BOTH_EMAIL_AND_PHONE)
      }
      if (createUserDto.password) {
        newUser.password = encryptUserPassword(createUserDto.password, salt)
      }
      if (createUserDto.phone) {
        newUser.phone = createUserDto.phone
        newUser.phoneCountry = createUserDto.phoneCountry
        newUser.accountLv = 1
      }
      if (createUserDto.email) {
        newUser.emailVerifyStatus = UserEmailVerifyStatus.VERIFIED
        newUser.email = createUserDto.email
        newUser.emailVerifyAt = new Date().getTime()
        newUser.accountLv = 2
      }
    }

    if (createUserDto.referrer) {
      const referrer = await this.getUserByReferrerCode(createUserDto.referrer)
      if (referrer) newUser.referredById = referrer.id
    }

    let user = await this.userRepository.save(newUser)

    if (createUserDto.referrerChannel) {
      const channel = await this.channelService.findByName(
        createUserDto.referrerChannel,
      )
      if (channel) {
        newUser.channelId = channel.id
        const tagIds = channel.tagIds ? JSON.parse(channel.tagIds) : []
        const insertUserTags = {
          tagIds: tagIds,
          userId: user.id,
        }
        const resultAddUserTag = await this.userTagService.create([
          insertUserTags,
        ])
        if (resultAddUserTag.length > 0) {
          user = await this.userRepository.save(newUser)
        }
      }
    }

    try {
      await this.syncUserToBce(user)
      await sleep(1000)
      this.logger.log(`Success sync user id: ${user.id}`)
    } catch (e) {
      this.logger.error(`Error sync user id: ${user.id}`)
      this.logger.error(e)
      this.logger.error(JSON.stringify(e?.response?.data))
      await this.errorSyncUserService.logErrorSyncUser(user.id)
    }

    return user
  }

  // Sync data with bce. Need to wait for it to complete before response
  async syncUserToBce(user: User) {
    const socialMode = user.ggId || user.fbId || user.appleId
    const dataToSync = classToPlain(user)
    dataToSync.agree_term = true
    dataToSync.password = 'FakePassword123!'
    dataToSync.password_confirmation = dataToSync.password
    dataToSync.internal_secret = this.configService.get('internal_secret')

    let bceRegisterUrl = `${this.configService.get(
      'bce_url',
    )}/api/internal/users`
    if (socialMode) {
      if (user.fbId) dataToSync.email = `fb-${user.fbId}`
      if (user.ggId) dataToSync.email = `gg-${user.ggId}`
      if (user.appleId) dataToSync.email = `apple-${user.appleId}`
      bceRegisterUrl = `${this.configService.get(
        'bce_url',
      )}/api/internal/social-network/fake-provider/register`
    } else {
      if (!user.email)
        dataToSync.email = `phone.${user.phoneCountry}${user.phone}@bitcastle.io`
    }

    await lastValueFrom(this.httpService.post(bceRegisterUrl, dataToSync))
  }

  async getUserByReferrerCode(referrerCode: string) {
    return await this.userRepository.findOne({
      referrerCode: referrerCode,
    })
  }

  async getLoginUser(loginDto: LoginDto) {
    let query = this.userRepository
      .createQueryBuilder('user')
      .addSelect(['user.password', 'user.salt', 'user.otpSecret'])

    if (loginDto.email) {
      query = query.where({ email: loginDto.email })
    } else if (loginDto.phone) {
      query = query.where({
        phoneCountry: loginDto.phoneCountry,
        phone: loginDto.phone,
      })
    }

    return await query.getOne()
  }

  async getUserByIdWithPrivateField(userId: string) {
    return await this.userRepository
      .createQueryBuilder('user')
      .where({ id: userId })
      .addSelect(['user.password', 'user.salt', 'user.otpSecret'])
      .getOne()
  }

  async checkPasswordWithUserId(userId: string, password: string) {
    const user = await this.getUserByIdWithPrivateField(userId)
    return user && this.checkPasswordWithUser(user, password)
  }

  /*
   * Validate password and update lastLogin (last_login) time
   */
  checkPasswordWithUser(user: User, password: string): boolean {
    // Legacy: BCE encrypt method
    if (user.passwordEncryptor == UserPasswordEncryptor.BCE) {
      return user.password === encryptBcePassword(password)
    }

    // Current: Auth 's encrypt method
    return user.password === encryptUserPassword(password, user.salt)
  }

  // Convert old encrypt method (BCE) to Auth 's encrypt method
  async useAuthPasswordEncryptor(user: User, password: string) {
    if (
      !user.passwordEncryptor ||
      user.passwordEncryptor == UserPasswordEncryptor.AUTH
    ) {
      return
    }
    user.passwordEncryptor = UserPasswordEncryptor.AUTH
    user.salt = randomString(5)
    user.password = encryptUserPassword(password, user.salt)
    await this.userRepository.save(user)
  }

  async updateLastLogin(user: User, time?: number) {
    user.lastLogin = time || new Date().getTime()
    await this.userRepository.save(user)
  }

  async setNewPassword(user: User, newPassword: string) {
    user.passwordEncryptor = UserPasswordEncryptor.AUTH
    user.password = encryptUserPassword(newPassword, user.salt)
    user.lastPasswordChange = new Date().getTime()
    await this.userRepository.save(user)
  }

  async logout(
    userId: string,
    deviceId: string,
    time?: number,
    byLogin?: boolean,
  ) {
    time = time || Date.now()
    const key = getUserLogoutKey(userId, deviceId)
    await this.redisService.set(
      key,
      time,
      this.configService.get<number>('refresh_jwt_exp'),
    )

    this.redisQueueService.addUserLogoutJob({ userId, deviceId, time, byLogin })
  }

  async logoutAllDevices(userId: string, exceptDeviceId?: string) {
    const deviceIds = await this.deviceMapService.getAllUserDeviceIds(userId)
    for (const deviceId of deviceIds) {
      if (exceptDeviceId == deviceId) continue
      await this.logout(userId, deviceId)

      this.redisQueueService.addUserProactivelyLogoutJob({ userId, deviceId })
    }
  }

  getLastLogoutTime(userId: string, deviceId: string) {
    return this.redisService.get(getUserLogoutKey(userId, deviceId))
  }

  async getOtpSecretByUserId(userId: string) {
    const user = await this.getUserByIdWithPrivateField(userId)
    return user ? decryptOtpSecret(user.otpSecret) : null
  }

  async addEmailAuthentication(
    user: User,
    addEmailAuthenticationDto: AddEmailAuthenticationDto,
  ) {
    user.email = addEmailAuthenticationDto.email
    user.salt = randomString(5)
    user.password = encryptUserPassword(
      addEmailAuthenticationDto.password,
      user.salt,
    )
    user.emailVerifyAt = new Date().getTime()
    user.lastPasswordChange = new Date().getTime()
    user.emailVerifyStatus = UserEmailVerifyStatus.VERIFIED

    this.redisQueueService.addUserChangeEmailJob({
      userId: user.id,
      newEmail: user.email,
      isModifiedByUser: true,
    })

    return await this.userRepository.save(user)
  }

  async changeEmail(user: User, newEmail: string, isModifiedByUser = true) {
    const oldEmail = user.email

    user.email = newEmail

    this.redisQueueService.addUserChangeEmailJob({
      userId: user.id,
      oldEmail,
      newEmail,
      isModifiedByUser,
    })

    return await this.userRepository.save(user)
  }

  async loginOrRegisterByFirebase(fireData) {
    const provider = fireData.providerUserInfo[0].providerId
    const firebaseId = fireData.firebaseId
    const phone = fireData.providerUserInfo[0].phoneNumber

    let phoneNumber = null
    let phoneCountry = null
    if (phone) {
      const phoneObject = parsePhoneNumber(phone)
      phoneNumber = phoneObject.nationalNumber
      phoneCountry = phoneObject.countryCallingCode
    }
    let existingUser = null
    switch (provider) {
      case 'facebook.com':
        existingUser = await this.getUserByFbId(firebaseId)
        break
      case 'google.com':
        existingUser = await this.getUserByGgId(firebaseId)
        break
      case 'apple.com':
        existingUser = await this.getUserByAppleId(firebaseId)
        break
      case 'phone':
        existingUser = await this.getUserByPhone(phoneCountry, phoneNumber)
        break
      default:
        throw new BusinessException(FirebaseError.PROVIDER_IS_NOT_SUPPORTED)
    }

    // Return user if existed
    if (existingUser) {
      return { isNewUser: false, user: existingUser }
    }

    // If not found, create new one
    const newUserDto: ICreateUserDto = {
      referrer: fireData.referrer,
    }
    switch (provider) {
      case 'facebook.com':
        newUserDto.fbId = firebaseId
        break
      case 'google.com':
        newUserDto.ggId = firebaseId
        break
      case 'apple.com':
        newUserDto.appleId = firebaseId
        break
      case 'phone':
        newUserDto.phoneCountry = phoneCountry
        newUserDto.phone = phoneNumber
        break
      default:
        newUserDto.ggId = firebaseId
    }

    // const existingUserCheck = await this.checkEmailExist(firebaseId)
    // if (existingUserCheck.exist) {
    //   throw new BusinessException(existingUserCheck.response)
    // }

    const newUser = await this.create(newUserDto)
    return { isNewUser: true, user: newUser }
  }

  async setAuthenticatorVerified(user: User) {
    user.isAuthenticatorVerified = true
    await this.userRepository.save(user)

    this.redisQueueService.addAuthenticatorStatusUpdatedJob({
      userId: user.id,
      otpSecret: decryptOtpSecret(user.otpSecret),
      status: UserAuthenticatorVerifyStatus.VERIFIED,
    })

    return user
  }

  async disableAuthenticator(user: User) {
    user.otpSecret = await encryptOtpSecret(generateAuthenticatorSecret())
    user.isAuthenticatorVerified = false
    await this.userRepository.save(user)

    this.redisQueueService.addAuthenticatorStatusUpdatedJob({
      userId: user.id,
      status: UserAuthenticatorVerifyStatus.UNVERIFIED,
    })

    return user
  }

  async checkEmailExist(email: string, exceptId: string = null) {
    let query = this.userRepository.createQueryBuilder('user').where(
      new Brackets((qb) => {
        qb.where({ email: email })
          .orWhere({ fbId: email })
          .orWhere({ ggId: email })
          .orWhere({ appleId: email })
      }),
    )
    if (exceptId) {
      query = query.andWhere({ id: Not(exceptId) })
    }
    const existedUser = await query.getOne()

    let response = null

    if (!existedUser) {
      return await this.userEmailService.checkEmailExist(email, exceptId)
    }
    if (compareCaseInsensitive(existedUser.fbId, email)) {
      response = EmailExistError.EXIST_IN_FB
    } else if (compareCaseInsensitive(existedUser.ggId, email)) {
      response = EmailExistError.EXIST_IN_GG
    } else if (compareCaseInsensitive(existedUser.appleId, email)) {
      response = EmailExistError.EXIST_IN_APPLE
    } else {
      response = EmailExistError.EXIST_IN_EMAIL
    }
    return {
      exist: true,
      response,
    }
  }

  async requestDeleteUser(userId: string) {
    const user = await this.getUserById(userId)
    user.requestDeleteAt = new Date().getTime()
    user.status = UserStatus.PENDING_DELETE
    await this.userRepository.save(user)

    this.redisQueueService.addUserRequestDeleteAccountJob({ userId })
  }

  async deleteUser(userId: string) {
    const user = await this.getUserById(userId)

    const userDeleteAccountEvent = {} as IUserDeleteAccountEvent
    userDeleteAccountEvent.userId = userId
    userDeleteAccountEvent.email = user.email

    user.status = UserStatus.INACTIVE
    if (user.email) {
      user.email = formatInfoToDelete(user.email)
      userDeleteAccountEvent.newEmail = user.email
    }
    if (user.ggId) user.ggId = formatInfoToDelete(user.ggId)
    if (user.fbId) user.fbId = formatInfoToDelete(user.fbId)
    if (user.appleId) user.appleId = formatInfoToDelete(user.appleId)
    if (user.phone) user.phone = formatInfoToDelete(user.phone)

    await this.userRepository.save(user)

    this.redisQueueService.addUserDeleteAccountJob(userDeleteAccountEvent)
  }

  async setUserInfoUpdated(userId: string) {
    await this.userRepository.update(
      { id: userId },
      { userInfoStatus: UserInfoStatus.UPDATED },
    )
  }

  async updateKycVerifyStatus(userId: string, status: UserKycVerifyStatus) {
    const user = await this.getUserById(userId)
    if (user.kycVerifyStatus == status) return

    const userKycStatusUpdatedEvent = {} as IUserKycStatusUpdatedEvent
    userKycStatusUpdatedEvent.oldStatus = user.kycVerifyStatus

    user.kycVerifyStatus = status

    if (status == UserKycVerifyStatus.REJECTED) {
      user.userInfoStatus = UserInfoStatus.NOT_UPDATED
      user.acceptLawStatus = AcceptLawStatus.NOT_ACCEPTED
    }
    await this.userRepository.save(user)

    userKycStatusUpdatedEvent.status = status
    userKycStatusUpdatedEvent.userId = userId

    this.redisQueueService.addKycStatusUpdatedJob(userKycStatusUpdatedEvent)

    return user
  }

  async acceptLaw(userId: string) {
    await this.userRepository.update(
      { id: userId },
      { acceptLawStatus: AcceptLawStatus.ACCEPTED },
    )
  }

  async updateLv(userId: string, lv: number, noDecreaseLv?: boolean) {
    const user = await this.getUserById(userId)
    if (lv == user.accountLv) return user
    if (noDecreaseLv && lv < user.accountLv) return user

    const userLvChangeEvent = {} as IUserChangeLvEvent
    userLvChangeEvent.userId = userId
    userLvChangeEvent.oldLevel = user.accountLv
    userLvChangeEvent.newLevel = lv

    user.accountLv = lv
    await this.userRepository.save(user)

    this.redisQueueService.addUserChangeLvJob(userLvChangeEvent)
    return user
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<User>> {
    return paginate<User>(this.userRepository, options)
  }

  async getStreamUsers() {
    return await this.userRepository.createQueryBuilder('user').stream()
  }

  async countReferralByUserId(
    userId: string,
    filter: ICountReferralFiler = {},
  ) {
    const conditions: FindConditions<User> = {
      referredById: userId,
      status: Not(UserStatus.INACTIVE),
    }
    const { fromLv } = filter
    if (fromLv) {
      conditions.accountLv = MoreThanOrEqual(fromLv)
    }
    return await this.userRepository.count(conditions)
  }

  async createBot(createBotDto: ICreateBotDto) {
    const bot = new User()
    bot.uuid = uuidv4()
    bot.type = UserType.BOT
    bot.status = UserStatus.ACTIVE
    bot.email = createBotDto.email
    bot.userInfoStatus = UserInfoStatus.UPDATED
    bot.acceptLawStatus = AcceptLawStatus.ACCEPTED
    bot.authenticatorVerifyStatus = UserAuthenticatorVerifyStatus.VERIFIED
    bot.emailVerifyStatus = UserEmailVerifyStatus.VERIFIED
    bot.kycVerifyStatus = UserKycVerifyStatus.VERIFIED
    bot.accountLv = 5
    bot.otpSecret = await encryptOtpSecret(generateAuthenticatorSecret())
    bot.salt = randomString(5)
    bot.password = encryptUserPassword(randomString(20), bot.salt)
    bot.referrerCode = `bot_${randomString(10)}_${new Date().getTime()}`

    await this.userRepository.save(bot)

    await this.redisQueueService.addUserCreatedJob({ userId: bot.id })

    try {
      await this.syncUserToBce(bot)
      this.logger.log(`Success sync bot id: ${bot.id}`)
    } catch (e) {
      this.logger.error(`Error sync bot id: ${bot.id}`)
      this.logger.error(e)
      this.logger.error(JSON.stringify(e?.response?.data))
      await this.errorSyncUserService.logErrorSyncUser(bot.id)
    }

    return bot
  }

  async getPendingDeleteUsers() {
    const daysBeforeDelete = this.configService.get('days_before_delete_user')
    return await this.userRepository.find({
      requestDeleteAt: LessThan(
        new Date().getTime() - daysBeforeDelete * 24 * 60 * 60 * 1000,
      ),
      status: Not(UserStatus.INACTIVE),
    })
  }

  async searchByFilter(filter: IUserFilter) {
    const query = this.buildSearchByFilterQuery(filter)

    const options: IPaginationOptions = {
      page: filter.page || 1,
      limit: filter.limit || 20,
      paginationType: PaginationTypeEnum.LIMIT_AND_OFFSET,
    }

    const result = await formatPaginate(paginate(query, options))
    return result
  }

  buildSearchByFilterQuery(filter: IUserFilter) {
    const {
      ids,
      email,
      type,
      statuses,
      kycVerifyStatuses,
      authenticatorVerifyStatuses,
      userInfoStatuses,
      accountLvFrom,
      accountLvTo,
      createdAtFrom,
      createdAtTo,
      lastLoginFrom,
      lastLoginTo,
      sort,
      sortType,
    } = filter
    const query = this.userRepository.createQueryBuilder()

    if (ids) {
      query.andWhereInIds(ids)
    }

    if (type) {
      query.andWhere('type = :type', { type })
    }

    if (email) {
      query.andWhere('email LIKE :email', {
        email: `%${escapeLikeChars(email)}%`,
      })
    }

    if (statuses) {
      query.andWhere('status IN (:...statuses)', { statuses })
    }

    if (kycVerifyStatuses) {
      query.andWhere('kyc_verify_statuses IN (:...kycVerifyStatuses)', {
        kycVerifyStatuses,
      })
    }

    if (authenticatorVerifyStatuses) {
      query.andWhere(
        'authenticator_verify_statuses IN (:...authenticatorVerifyStatuses)',
        { authenticatorVerifyStatuses },
      )
    }

    if (userInfoStatuses) {
      query.andWhere('user_info_statuses IN (:...userInfoStatuses)', {
        userInfoStatuses,
      })
    }

    if (accountLvFrom) {
      query.andWhere('account_lv > :accountLvFrom', { accountLvFrom })
    }

    if (accountLvTo) {
      query.andWhere('account_lv < :accountLvTo', { accountLvTo })
    }

    if (createdAtFrom) {
      query.andWhere('created_at > :createdAtFrom', { createdAtFrom })
    }

    if (createdAtTo) {
      query.andWhere('created_at < :createdAtTo', { createdAtTo })
    }

    if (lastLoginFrom) {
      query.andWhere('last_login > :lastLoginFrom', { lastLoginFrom })
    }

    if (lastLoginTo) {
      query.andWhere('last_login < :lastLoginTo', { lastLoginTo })
    }

    if (sort) {
      query.orderBy(sort, sortType || 'ASC')
    } else {
      query.orderBy('created_at', 'ASC')
    }
    query.addOrderBy('id', 'ASC')

    return query
  }

  async toggleBanUsers(ids: string[], isBanned = false) {
    return this.userRepository.update({ id: In(ids) }, { isBanned })
  }

  async listDividendUser(dto: ListDividendUserDto) {
    const page = dto.page || 1
    const take = dto.take || 20

    const whereOptions: FindConditions<User>[] = []
    if (dto.where.isBanned !== undefined) {
      whereOptions.push({ isBanned: dto.where.isBanned })
    }
    if (dto.where.statuses !== undefined) {
      whereOptions.push({ status: In(dto.where.statuses) })
    }
    if (dto.where.types !== undefined) {
      whereOptions.push({ type: In(dto.where.types) })
    }

    const [data, total] = await this.userRepository.findAndCount({
      select: ['id', 'status', 'type', 'isBanned'],
      where: whereOptions,
      skip: (page - 1) * take,
      take,
    })

    return { total, page, take, data }
  }
}
