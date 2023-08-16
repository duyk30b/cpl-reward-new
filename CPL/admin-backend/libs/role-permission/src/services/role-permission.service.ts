import { RedisService } from '@lib/redis'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Not, Repository } from 'typeorm'
import { Permission } from '../../../../apps/api/src/permissions/permission.data'
import { RolePermissionEntity } from '../entities/role-permission.entity'
import { RoleScreenEntity } from '@lib/role-permission/entities/role-screen.entity'

@Injectable()
export class RolePermissionService {
  constructor(
    @InjectRepository(RolePermissionEntity)
    private readonly rolePermissionRepository: Repository<RolePermissionEntity>,
    @InjectRepository(RoleScreenEntity)
    private readonly roleScreenRepository: Repository<RoleScreenEntity>,
    private readonly redisService: RedisService,
  ) {}

  async addPermissionsToRole(roleId: string, permissionIds: number[]) {
    if (!permissionIds) permissionIds = []
    await this.rolePermissionRepository.delete({
      roleId,
      permissionId: Not(In(permissionIds)),
    })
    const existedPermissions = await this.rolePermissionRepository.find({
      roleId,
      permissionId: In(permissionIds),
    })
    const existedPermissionIds = existedPermissions.map(
      (relation) => relation.permissionId,
    )
    const newPermissionIds = permissionIds.filter(
      (id) => !existedPermissionIds.find((existedId) => existedId == id),
    )
    const dataInsert = newPermissionIds.map((permissionId) => ({
      permissionId,
      roleId,
    }))
    return await this.rolePermissionRepository.save(dataInsert)
  }

  async addScreensToRole(roleId: string, screenIds: number[]) {
    if (!screenIds) screenIds = []
    await this.roleScreenRepository.delete({
      roleId,
      screenId: Not(In(screenIds)),
    })
    const existedScreens = await this.roleScreenRepository.find({
      roleId,
      screenId: In(screenIds),
    })
    const existedScreenIds = existedScreens.map((relation) => relation.screenId)
    const newScreenIds = screenIds.filter(
      (id) => !existedScreenIds.find((existedId) => existedId == id),
    )
    const dataInsert = newScreenIds.map((screenId) => ({
      screenId,
      roleId,
    }))
    return await this.roleScreenRepository.save(dataInsert)
  }

  async getPermissionsByRoleId(roleId: string) {
    const records = await this.rolePermissionRepository.find({ roleId })
    return records.map((record) => record.permissionId)
  }

  async getScreensByRoleId(roleId: string) {
    const records = await this.roleScreenRepository.find({ roleId })
    return records.map((record) => record.screenId)
  }

  async getPermissionsByRoleIds(roleIds: string[]) {
    const records = await this.rolePermissionRepository.find({
      roleId: In(roleIds),
    })
    return records.map((record) => record.permissionId)
  }

  async getScreensByRoleIds(roleIds: string[]) {
    const records = await this.roleScreenRepository.find({
      roleId: In(roleIds),
    })
    return records.map((record) => record.screenId)
  }

  async getRoleIdsByPermissionId(permissionId: Permission) {
    const records = await this.rolePermissionRepository.find({ permissionId })
    return records.map((record) => record.roleId)
  }
}
