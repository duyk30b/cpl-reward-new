import { Module } from '@nestjs/common'
import { InternalUserTagController } from './internal-user-tag.controller'
import { UserTagModule } from '@lib/user-tag'
import { InternalUserTagService } from './internal-user-tag.service'

@Module({
  imports: [UserTagModule],
  controllers: [InternalUserTagController],
  providers: [InternalUserTagService],
})
export class InternalUserTagModule {}
