import { Module } from '@nestjs/common'
import { AdminService } from './admin.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Admin } from './entities/admin.entity'
import { RedisModule } from '@lib/redis'
import { RolePermissionModule } from 'libs/role-permission/src/role-permission.module'
import { NotificationModule } from '@lib/grpc-client/notification'
import { AdminListener } from './admin.listener'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Admin]),
    RedisModule,
    RolePermissionModule,
    NotificationModule,
  ],
  providers: [AdminService, AdminListener],
  exports: [AdminService],
})
export class AdminModule {}
