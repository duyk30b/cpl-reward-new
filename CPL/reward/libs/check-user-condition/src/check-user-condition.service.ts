import { UserDto, UserService } from '@app/grpc-client'
import { UserInfoService } from '@app/grpc-client/user-info'
import { UserInfoDto } from '@app/grpc-client/user-info/user-info.dto'
import { comparison } from '@lib/common'
import { UserCondition } from '@libs/typeorm/mission'
import { Injectable } from '@nestjs/common'
import { ObjectType } from './check-user-condition.variable'

export class UserConditionResolver {
  private userId: string
  private userService: UserService
  private userInfoService: UserInfoService
  private user: UserDto
  private userInfo: UserInfoDto
  private loaded = {
    user: false,
    userInfo: false,
  }

  constructor(userId: string, userService: UserService, userInfoService: UserInfoService) {
    this.userId = userId
    this.userService = userService
    this.userInfoService = userInfoService
  }

  async checkUserConditions(conditions: UserCondition[]) {
    for (const condition of conditions) {
      const result = await this.checkCondition(condition)
      if (!result.pass) {
        return result
      }
    }
    return {
      pass: true,
    }
  }

  private async checkCondition(
    condition: UserCondition,
  ): Promise<{ pass: boolean; error?: string }> {
    const { operator, value, type, property } = condition

    let objectType = property
    let field = property

    if (property.includes('.')) {
      ;[objectType, field] = property.split('.')
    } else {
      objectType = ObjectType.USER
      field = property
    }

    const object = await this.getObject(objectType)

    if (!object || object[field] === undefined) {
      return {
        pass: false,
        error: `Property "${property}" does not exist in object`,
      }
    }

    if (!comparison(object[field], operator, value, type)) {
      return {
        pass: false,
        error: `${property}: ${object[field]} ${operator} ${value} failed`,
      }
    }

    return {
      pass: true,
    }
  }

  private async getUser() {
    if (!this.loaded.user) {
      this.user = await this.userService.findById(this.userId)
      this.loaded.user = true
    }
    return this.user
  }

  private async getUserInfo() {
    if (!this.loaded.userInfo) {
      this.userInfo = await this.userInfoService.findByUserId(this.userId)
      this.loaded.userInfo = true
    }
    return this.userInfo
  }

  private async getObject(objectType: string) {
    const map = {
      [ObjectType.USER]: this.getUser,
      [ObjectType.USER_INFO]: this.getUserInfo,
    }
    const functionToGetObject = map[objectType]
    if (!functionToGetObject) return null
    return await functionToGetObject.bind(this)()
  }
}

@Injectable()
export class CheckUserConditionService {
  constructor(
    private readonly userService: UserService,
    private readonly userInfoService: UserInfoService,
  ) {}

  getUserResolver(userId: string) {
    return new UserConditionResolver(userId, this.userService, this.userInfoService)
  }

  async checkUserConditions(
    userId: string,
    conditions: UserCondition[],
  ): Promise<{ error?: string[]; pass: boolean }> {
    const resolver = new UserConditionResolver(userId, this.userService, this.userInfoService)
    const result = await resolver.checkUserConditions(conditions)

    if (!result.pass) return { pass: false, error: [result.error] }
    return { pass: true, error: [] }
  }
}
