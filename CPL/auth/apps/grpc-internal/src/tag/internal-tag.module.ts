import { Module } from '@nestjs/common'
import { TagModule } from '@lib/tag'
import { InternalTagController } from './internal-tag.controller'
import { InternalTagService } from './internal-tag.service'

@Module({
  imports: [TagModule],
  controllers: [InternalTagController],
  providers: [InternalTagService],
})
export class InternalTagModule {}
