import { RedisService } from '@lib/redis'
import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import {
  AdminPermissionUpdatedEvent,
  PermissionEvent,
  RoleUpdatedEvent,
} from './permission.event'
import {
  getUserPermissionCacheKey,
  getUserScreenCacheKey,
} from './permission.helper'
import { UserRoleService } from './services/user-role.service'

@Injectable()
export class PermissionListener {
  constructor(
    private readonly redisService: RedisService,
    private readonly userRoleService: UserRoleService,
  ) {}

  @OnEvent(PermissionEvent.ROLE_UPDATED)
  async handleRoleUpdatedEvent(event: RoleUpdatedEvent) {
    const adminIds = await this.userRoleService.getUserIdsByRoleId(event.roleId)
    for (let i = 0; i < adminIds.length; i++) {
      await this.redisService.del(getUserPermissionCacheKey(adminIds[i]))
      await this.redisService.del(getUserScreenCacheKey(adminIds[i]))
    }
  }

  @OnEvent(PermissionEvent.ADMIN_PERMISSION_UPDATED)
  async handleAdminPermissionUpdatedEvent(event: AdminPermissionUpdatedEvent) {
    await this.redisService.del(getUserPermissionCacheKey(event.adminId))
    await this.redisService.del(getUserScreenCacheKey(event.adminId))
  }
}
