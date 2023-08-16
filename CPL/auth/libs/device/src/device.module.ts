import { Module } from '@nestjs/common'
import { DeviceService } from './services/device.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { Device } from './entities/device.entity'
import { DeviceMap } from './entities/device-map.entity'
import { DeviceMapService } from './services/device-map.service'

@Module({
  imports: [TypeOrmModule.forFeature([Device, DeviceMap]), ConfigModule],
  providers: [DeviceService, DeviceMapService],
  exports: [DeviceService, DeviceMapService],
})
export class DeviceModule {}
