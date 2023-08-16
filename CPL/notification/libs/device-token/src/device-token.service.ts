import { Injectable } from '@nestjs/common'
import { InjectConnection, InjectRepository } from '@nestjs/typeorm'
import { Connection, FindCondition, In, LessThan, Repository } from 'typeorm'
import { RegisterTokenDto } from './dto/register-token.dto'
import { DeviceToken } from './entities/device-token.entity'

@Injectable()
export class DeviceTokenService {
  constructor(
    @InjectRepository(DeviceToken)
    private readonly deviceTokenRepository: Repository<DeviceToken>,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async registerToken(registerTokenDto: RegisterTokenDto) {
    const { deviceId, userId, token } = registerTokenDto
    await this.deactiveTokenOfDevice(deviceId)
    await this.deactiveToken(token)

    let tokenRecord = await this.deviceTokenRepository.findOne({
      where: {
        deviceId: registerTokenDto.deviceId,
        userId: registerTokenDto.userId,
      },
    })

    if (!tokenRecord) {
      tokenRecord = new DeviceToken()
      tokenRecord.userId = userId
      tokenRecord.deviceId = deviceId
    }

    tokenRecord.token = token
    tokenRecord.isActive = true
    tokenRecord.refreshedAt = new Date().getTime()
    return await this.deviceTokenRepository.save(tokenRecord)
  }

  async deactiveToken(token: string) {
    await this.deviceTokenRepository.update({ token }, { isActive: false })
  }

  async deactiveTokens(tokens: string[]) {
    if (!tokens.length) return
    await this.deviceTokenRepository.update(
      { token: In(tokens) },
      { isActive: false },
    )
  }

  async deactiveTokenOfDevice(deviceId: string) {
    await this.deviceTokenRepository.update({ deviceId }, { isActive: false })
  }

  async deactiveTokenOfUserAndDevice(
    userId: string,
    deviceId: string,
    beforeTime?: number,
  ) {
    const conditions: FindCondition<DeviceToken> = { userId, deviceId }
    if (beforeTime) {
      conditions.refreshedAt = LessThan(beforeTime)
    }
    await this.deviceTokenRepository.update(conditions, { isActive: false })
  }

  async getActiveTokensOfUser(userId: string) {
    const records = await this.deviceTokenRepository.find({
      userId,
      isActive: true,
    })
    return records.map((record) => record.token)
  }
}
