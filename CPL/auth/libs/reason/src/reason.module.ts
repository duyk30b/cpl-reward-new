import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ReasonService } from './services/reason/reason.service'
import { ReasonCategoryService } from './services/category/reason-category.service'
import { ReasonEntity } from './entities/reason.entity'
import { ReasonCategoryEntity } from './entities/reason-category.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ReasonEntity, ReasonCategoryEntity])],
  providers: [ReasonService, ReasonCategoryService],
  exports: [ReasonService, ReasonCategoryService],
})
export class ReasonModule {}
