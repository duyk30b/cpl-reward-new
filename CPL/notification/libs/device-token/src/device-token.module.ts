import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DeviceTokenService } from './device-token.service'
import { DeviceToken } from './entities/device-token.entity'

@Module({
  imports: [TypeOrmModule.forFeature([DeviceToken])],
  providers: [DeviceTokenService],
  exports: [DeviceTokenService],
})
export class DeviceTokenModule {}
