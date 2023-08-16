import { RedisService } from '@lib/redis'
import { arrayUnique } from '@lib/util'
import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { ICreateRoleDto, IUpdateRoleDto } from '../interfaces/role.interface'
import { PermissionEvent } from '../permission.event'
import {
  getUserPermissionCacheKey,
  getUserScreenCacheKey,
} from '../permission.helper'
import { RolePermissionService } from './role-permission.service'
import { RoleService } from './role.service'
import { UserPermissionService } from './user-permission.service'
import { UserRoleService } from './user-role.service'
import { AdminScreenService } from '@lib/role-permission/services/user-screen.service'

@Injectable()
export class PermissionAggregateService {
  constructor(
    private readonly rolePermissionService: RolePermissionService,
    private readonly userPermissionService: UserPermissionService,
    private readonly adminScreenService: AdminScreenService,
    private readonly userRoleService: UserRoleService,
    private readonly roleService: RoleService,
    private readonly redisService: RedisService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /////// GET ALL USER PERMISSION ///////
  async getUserRolePermission(userId: string) {
    const cache = await this.redisService.get(getUserPermissionCacheKey(userId))
    if (cache) return cache as number[]

    // 1. get all role of user
    const roleIds = await this.userRoleService.getRolesByUserId(userId)

    // 2. get all permission on role permission
    let rolePermissions: number[] = []
    if (roleIds.length > 0) {
      rolePermissions =
        await this.rolePermissionService.getPermissionsByRoleIds(roleIds)
    }

    // 3. get all permission on user permission
    const userPermissions =
      await this.userPermissionService.getPermissionsByUserId(userId)

    const permissions = arrayUnique([...rolePermissions, ...userPermissions])

    await this.redisService.set(
      getUserPermissionCacheKey(userId),
      permissions,
      {
        ttl: 3600,
      },
    )

    return permissions
  }

  async getUserRoleScreen(userId: string) {
    const cache = await this.redisService.get(getUserScreenCacheKey(userId))
    if (cache) return cache as number[]

    // 1. get all role of user
    const roleIds = await this.userRoleService.getRolesByUserId(userId)

    // 2. get all screen on role screen
    let roleScreens: number[] = []
    if (roleIds.length > 0) {
      roleScreens = await this.rolePermissionService.getScreensByRoleIds(
        roleIds,
      )
    }

    // 3. get all screen on user screen
    const adminScreens = await this.adminScreenService.getScreensByUserId(
      userId,
    )

    const screens = arrayUnique([...roleScreens, ...adminScreens])

    await this.redisService.set(getUserScreenCacheKey(userId), screens, {
      ttl: 3600,
    })

    return screens
  }

  async createRoleWithPermissions(createRole: ICreateRoleDto) {
    const role = await this.roleService.create(createRole)
    await this.rolePermissionService.addPermissionsToRole(
      role.id,
      createRole.permissions,
    )
    return { success: true }
  }

  async updateRoleWithPermissionsAndScreens(
    roleId: string,
    updateRole: IUpdateRoleDto,
  ) {
    const role = await this.roleService.update(roleId, updateRole)
    await this.rolePermissionService.addPermissionsToRole(
      role.id,
      updateRole.permissions,
    )
    await this.rolePermissionService.addScreensToRole(
      role.id,
      updateRole.screens,
    )
    this.eventEmitter.emit(PermissionEvent.ROLE_UPDATED, { roleId })
    return { success: true }
  }

  async addRolePermissionScreenToAdmin(
    adminId: string,
    roleIds: string[],
    permissionIds: number[],
    screenIds: number[],
  ) {
    await this.userRoleService.addRolesToUser(adminId, roleIds)
    await this.userPermissionService.addPermissionsToUser(
      adminId,
      permissionIds,
    )
    await this.adminScreenService.addScreensToAdmin(adminId, screenIds)
    this.eventEmitter.emit(PermissionEvent.ADMIN_PERMISSION_UPDATED, {
      adminId,
    })
    return { success: true }
  }

  async findRoleByIdWithPermissions(roleId: string) {
    const role = await this.roleService.findById(roleId)
    role.permissions = await this.rolePermissionService.getPermissionsByRoleId(
      roleId,
    )
    role.screens = await this.rolePermissionService.getScreensByRoleId(roleId)
    return role
  }

  async findRolesByAdminId(adminId: string) {
    const roleIds = await this.userRoleService.getRolesByUserId(adminId)
    return await this.roleService.findByIds(roleIds)
  }
}
