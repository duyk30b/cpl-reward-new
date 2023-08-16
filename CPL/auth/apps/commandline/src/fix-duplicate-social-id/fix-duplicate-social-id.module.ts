import { User } from '@lib/user/entities/user.entity'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BceUser } from 'apps/api-public/src/modules/bce-convert/bce-user.entity'
import { FixDuplicateSocialIdService } from './fix-duplicate-social-id.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([BceUser], 'bce'),
  ],
  providers: [FixDuplicateSocialIdService],
})
export class FixDuplicateSocialIdModule {}
