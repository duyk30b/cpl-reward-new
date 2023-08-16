import { Module } from '@nestjs/common'
import { ApiDeviceTokenService } from './api-device-token.service'
import { ApiDeviceTokenController } from './api-device-token.controller'
import { DeviceTokenModule } from '@libs/device-token'
import { RedisModule } from '@libs/redis'

@Module({
  imports: [DeviceTokenModule, RedisModule],
  controllers: [ApiDeviceTokenController],
  providers: [ApiDeviceTokenService],
})
export class ApiDeviceTokenModule {}
