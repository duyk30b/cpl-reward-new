import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ErrorSyncUser } from './error-sync-user.entity'
import { ErrorSyncUserService } from './error-sync-user.service'

@Module({
  imports: [TypeOrmModule.forFeature([ErrorSyncUser])],
  providers: [ErrorSyncUserService],
  exports: [ErrorSyncUserService],
})
export class ErrorSyncUserModule {}
