import { Module } from '@nestjs/common'
import { UserKycCynopsisService } from './user-kyc-cynopsis.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserKycCynopsis } from './entities/user-kyc-cynopsis.entity'

@Module({
  imports: [TypeOrmModule.forFeature([UserKycCynopsis])],
  providers: [UserKycCynopsisService],
  exports: [UserKycCynopsisService],
})
export class UserKycCynopsisModule {}
