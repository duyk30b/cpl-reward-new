import { UserModule } from '@lib/user'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BlacklistDevice } from './entities/blacklist-device.entity'
import { BlacklistUser } from './entities/blacklist-user.entity'
import { BlacklistDeviceService } from './services/blacklist-device.service'
import { BlacklistUserService } from './services/blacklist-user.service'
import { BlacklistService } from './services/blacklist.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([BlacklistUser, BlacklistDevice]),
    UserModule,
  ],
  providers: [BlacklistService, BlacklistUserService, BlacklistDeviceService],
  exports: [BlacklistUserService, BlacklistDeviceService],
})
export class BlacklistModule {}
