import { generateAuthenticatorSecret } from '@lib/otp'
import { RedisService } from '@lib/redis'
import { PermissionAggregateService } from '@lib/role-permission/services/permission-aggregate.service'
import { UserRoleService } from '@lib/role-permission/services/user-role.service'
import { RolePermissionService } from '@lib/role-permission/services/role-permission.service'
import { UserPermissionService } from '@lib/role-permission/services/user-permission.service'
import {
  escapeLikeChars,
  formatPaginate,
  getUserLogoutKey,
  randomString,
  ValidationException,
} from '@lib/util'
import { ValidationError } from '@lib/util/formater/error'
import {
  decryptOtpSecret,
  encryptOtpSecret,
} from '@lib/util/helpers/encryption.helper'
import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { createHash } from 'crypto'
import {
  IPaginationOptions,
  paginate,
  PaginationTypeEnum,
} from 'nestjs-typeorm-paginate'
import { Brackets, In, Repository } from 'typeorm'
import { Permission } from '../../../apps/api/src/permissions/permission.data'
import { AdminCreatedEvent, AdminEvent } from './admin.event'
import { getAdminCacheKey } from './admin.helper'
import { IAdminFilterDto, ICreateAdminDto } from './admin.interface'
import { Admin } from './entities/admin.entity'

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly redisService: RedisService,
    private readonly permissionAggregateService: PermissionAggregateService,
    private readonly eventEmitter: EventEmitter2,
    private readonly userPermissionService: UserPermissionService,
    private readonly rolePermissionService: RolePermissionService,
    private readonly userRoleService: UserRoleService,
  ) {}

  async getAdminById(adminId: string): Promise<Admin> {
    return this.adminRepository.findOne({ id: adminId })
  }

  async getAdminByIds(adminIds: string[]): Promise<Admin[]> {
    return this.adminRepository.find({ id: In(adminIds) })
  }

  async getAdminWithPermissionsAndScreens(admin: Admin) {
    admin.permissions =
      await this.permissionAggregateService.getUserRolePermission(admin.id)
    admin.screens = await this.permissionAggregateService.getUserRoleScreen(
      admin.id,
    )
    return admin
  }

  async getAdminByIdWithPrivateField(adminId: string): Promise<Admin> {
    let query = this.adminRepository
      .createQueryBuilder('admin')
      .addSelect(['admin.password', 'admin.salt', 'admin.otpSecret'])

    query = query.where({ id: adminId })
    return await query.getOne()
  }

  async getAdminByIdWithCache(adminId: string): Promise<Admin> {
    const key = getAdminCacheKey(adminId)
    const cache = await this.redisService.get(key)
    if (cache) return plainToInstance(Admin, cache, { ignoreDecorators: true })
    const admin = await this.getAdminById(adminId)
    await this.redisService.set(key, admin, {
      ttl: 3600,
    })
    return admin
  }

  async getAdminByEmail(email: string): Promise<Admin> {
    return await this.adminRepository.findOne({
      where: { email },
    })
  }

  async createAdmin(createAdminDto: ICreateAdminDto) {
    const existedAdmin = await this.getAdminByEmail(createAdminDto.email)
    if (existedAdmin) {
      throw new ValidationException([
        {
          property: 'email',
          constraints: {
            existed: ValidationError.EXISTED_IN_SYSTEM,
          },
        },
      ])
    }
    const salt = randomString(6)
    const password = randomString(15)
    const encryptedPassword = this.encryptPassword(password, salt)
    const authenticatorSecret = generateAuthenticatorSecret()
    const encryptedAuthenticatorSecret = await encryptOtpSecret(
      authenticatorSecret,
    )
    const admin = plainToInstance(
      Admin,
      {
        email: createAdminDto.email,
        name: createAdminDto.name,
        password: encryptedPassword,
        salt,
        otpSecret: encryptedAuthenticatorSecret,
      },
      { ignoreDecorators: true },
    )

    const adminCreatedEvent = new AdminCreatedEvent()
    adminCreatedEvent.email = admin.email
    adminCreatedEvent.name = admin.name
    adminCreatedEvent.password = password
    adminCreatedEvent.authenticatorSecret = authenticatorSecret
    this.eventEmitter.emit(AdminEvent.CREATED, adminCreatedEvent)

    return await this.adminRepository.save(admin)
  }

  async updateAuthenticator(adminId: string, authenticatorCode: string) {
    const admin = await this.adminRepository.findOne(adminId)
    admin.authenticatorCode = authenticatorCode
    return await this.adminRepository.save(admin)
  }

  async getOtpSecretByAminId(adminId: string) {
    let admin = await this.getAdminByIdWithPrivateField(adminId)
    if (!admin.otpSecret) {
      const otpSecret = await encryptOtpSecret(generateAuthenticatorSecret())
      admin.otpSecret = otpSecret
      admin = await this.adminRepository.save(admin)
    }
    return admin && admin.otpSecret ? decryptOtpSecret(admin.otpSecret) : null
  }

  async changePassword(
    adminId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const admin = await this.getAdminByIdWithPrivateField(adminId)

    if (oldPassword == newPassword) {
      throw new ValidationException([
        {
          property: 'newPassword',
          constraints: {
            existed: ValidationError.SAME_AS_OLD_PASSWORD,
          },
        },
      ])
    }

    const encryptedPassword = this.encryptPassword(oldPassword, admin.salt)

    if (admin.password != encryptedPassword) {
      throw new ValidationException([
        {
          property: 'oldPassword',
          constraints: {
            existed: ValidationError.PASSWORD_NOT_MATCH,
          },
        },
      ])
    }

    admin.password = this.encryptPassword(newPassword, admin.salt)
    admin.isFirstLogin = false
    await this.adminRepository.save(admin)
  }

  async checkPassword(email: string, password: string) {
    let query = this.adminRepository
      .createQueryBuilder('admin')
      .addSelect([
        'admin.id',
        'admin.password',
        'admin.email',
        'admin.salt',
        'admin.otpSecret',
        'admin.isFirstLogin',
        'admin.authenticatorCode',
      ])

    query = query.where({ email: email })
    const existingAdmin = await query.getOne()
    if (!existingAdmin) {
      return null
    }

    const encryptedPassword = this.encryptPassword(password, existingAdmin.salt)
    if (existingAdmin.password === encryptedPassword) {
      return existingAdmin
    }

    return null
  }

  getLastLogoutTime(userId: string) {
    return this.redisService.get(getUserLogoutKey(userId, 'device_id'))
  }

  encryptPassword(password: string, salt: string): string {
    return createHash('sha256')
      .update(salt + password)
      .digest()
      .toString('base64')
  }

  async findAll(adminFilterDto: IAdminFilterDto) {
    const query = this.buildListAdminQuery(adminFilterDto)

    const options: IPaginationOptions = {
      page: adminFilterDto.page || 1,
      limit: adminFilterDto.limit || 20,
      paginationType: PaginationTypeEnum.LIMIT_AND_OFFSET,
    }

    const result = await formatPaginate(paginate(query, options))
    for (let i = 0; i < result.data.length; i++) {
      const admin = result.data[i]
      admin.roleEntities =
        await this.permissionAggregateService.findRolesByAdminId(admin.id)
    }
    return result
  }

  private buildListAdminQuery(adminFilterDto: IAdminFilterDto) {
    const ADMIN_SORT_FIELD_MAP = {
      email: 'email',
      name: 'name',
      created_at: 'created_at',
    }

    const ADMIN_SEARCH_FIELD_MAP = {
      email: 'email',
      name: 'name',
    }

    const query = this.adminRepository.createQueryBuilder()

    const { searchField, searchText, sort, sortType } = adminFilterDto

    if (searchText) {
      query.andWhere(
        new Brackets((qb) => {
          if (searchField && ADMIN_SEARCH_FIELD_MAP[searchField]) {
            qb.where(`${ADMIN_SEARCH_FIELD_MAP[searchField]} LIKE :keyword`)
          } else {
            Object.keys(ADMIN_SEARCH_FIELD_MAP).forEach((field) => {
              qb.orWhere(`${ADMIN_SEARCH_FIELD_MAP[field]} LIKE :keyword`)
            })
          }
        }),
        {
          keyword: `%${escapeLikeChars(searchText)}%`,
        },
      )
    }

    if (sort && ADMIN_SORT_FIELD_MAP[sort]) {
      query.orderBy(ADMIN_SORT_FIELD_MAP[sort], sortType || 'ASC')
    } else {
      query.orderBy('created_at', 'DESC')
    }
    query.addOrderBy('id', 'ASC')

    return query
  }

  async removeAdminCache(adminId: string) {
    await this.redisService.del(getAdminCacheKey(adminId))
  }

  getAll() {
    return this.adminRepository.find()
  }

  async getAdminsByPermissionId(permissionId: Permission) {
    const userIdsHasPermission: string[] =
      await this.userPermissionService.getUserIdsByPermissionId(permissionId)
    const roleIdsHasPermission: string[] =
      await this.rolePermissionService.getRoleIdsByPermissionId(permissionId)
    const userIdsHasRole: string[] =
      await this.userRoleService.getUserIdsByRoleIds(roleIdsHasPermission)

    const userIdsMerge = [...userIdsHasPermission, ...userIdsHasRole]
    const userIds = [...new Set(userIdsMerge)]

    return await this.adminRepository.find({
      id: In(userIds),
    })
  }
}
