import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserKycAdminDecision } from './entities/user-kyc-admin-decision.entity'
import { UserKycAdminService } from './user-kyc-admin.service'

@Module({
  imports: [TypeOrmModule.forFeature([UserKycAdminDecision])],
  providers: [UserKycAdminService],
  exports: [UserKycAdminService],
})
export class UserKycAdminModule {}
