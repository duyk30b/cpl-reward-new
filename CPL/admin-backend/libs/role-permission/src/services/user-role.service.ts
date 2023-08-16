import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Not, Repository } from 'typeorm'
import { UserRoleEntity } from '../entities/user-role.entity'

@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRoleEntity)
    private readonly userRoleRepository: Repository<UserRoleEntity>,
  ) {}

  async addRolesToUser(userId: string, roleIds: string[]) {
    if (!roleIds) roleIds = []
    await this.userRoleRepository.delete({
      userId,
      roleId: Not(In(roleIds)),
    })
    const existedRoles = await this.userRoleRepository.find({
      userId,
      roleId: In(roleIds),
    })
    const existedRoleIds = existedRoles.map((relation) => relation.roleId)
    const newRoleIds = roleIds.filter(
      (id) => !existedRoleIds.find((existedId) => existedId == id),
    )
    const dataInsert = newRoleIds.map((roleId) => ({
      roleId,
      userId,
    }))
    return await this.userRoleRepository.save(dataInsert)
  }

  async getRolesByUserId(userId: string) {
    const records = await this.userRoleRepository.find({ userId })
    return records.map((record) => record.roleId)
  }

  async getUserIdsByRoleId(roleId: string) {
    const records = await this.userRoleRepository.find({ roleId })
    return records.map((record) => record.userId)
  }

  async getUserIdsByRoleIds(roleIds: string[]) {
    const records = await this.userRoleRepository.find({
      roleId: In(roleIds),
    })
    return records.map((record) => record.userId)
  }
}
