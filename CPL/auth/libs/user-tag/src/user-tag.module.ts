import { Module } from '@nestjs/common'
import { UserTagService } from './user-tag.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserTag } from '@lib/user-tag/entities/user-tag.entity'

@Module({
  imports: [TypeOrmModule.forFeature([UserTag])],
  providers: [UserTagService],
  exports: [UserTagService],
})
export class UserTagModule {}
