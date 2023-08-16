import { Module } from '@nestjs/common'
import { AuthDeviceService } from './auth-device.service'
import { AuthDeviceController } from './auth-device.controller'
import { DeviceModule } from '@lib/device'
import { UserModule } from '@lib/user'
import { RedisQueueModule } from '@lib/redis-queue'

@Module({
  imports: [DeviceModule, UserModule, RedisQueueModule],
  controllers: [AuthDeviceController],
  providers: [AuthDeviceService],
})
export class AuthDeviceModule {}
