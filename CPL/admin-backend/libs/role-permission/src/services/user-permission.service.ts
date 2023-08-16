import { RedisService } from '@lib/redis'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Not, Repository } from 'typeorm'
import { Permission } from '../../../../apps/api/src/permissions/permission.data'
import { UserPermissionEntity } from '../entities/user-permission.entity'

@Injectable()
export class UserPermissionService {
  constructor(
    @InjectRepository(UserPermissionEntity)
    private readonly userPermissionRepository: Repository<UserPermissionEntity>,
    private readonly redisService: RedisService,
  ) {}

  async addPermissionsToUser(userId: string, permissionIds: number[]) {
    if (!permissionIds) permissionIds = []
    await this.userPermissionRepository.delete({
      userId,
      permissionId: Not(In(permissionIds)),
    })
    const existedPermissions = await this.userPermissionRepository.find({
      userId,
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
      userId,
    }))
    return await this.userPermissionRepository.save(dataInsert)
  }

  async getPermissionsByUserId(userId: string) {
    const records = await this.userPermissionRepository.find({ userId })
    return records.map((record) => record.permissionId)
  }

  async getUserIdsByPermissionId(permissionId: Permission) {
    const records = await this.userPermissionRepository.find({ permissionId })
    return records.map((record) => record.userId)
  }
}
