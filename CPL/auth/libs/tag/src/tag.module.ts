import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TagService } from './tag.service'
import { Tag } from '@lib/tag/entities/tag.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
