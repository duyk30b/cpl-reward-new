import { UserKycHistory } from '@lib/user-kyc/entities/user-kyc-history.entity'
import { UserKyc } from '@lib/user-kyc/entities/user-kyc.entity'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FixKycImageService } from './fix-kyc-image.service'

@Module({
  imports: [TypeOrmModule.forFeature([UserKyc, UserKycHistory])],
  providers: [FixKycImageService],
})
export class FixKycImageModule {}
