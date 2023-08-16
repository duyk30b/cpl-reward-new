import { Module } from '@nestjs/common'
import { ReasonModule } from 'lib/reason'
import { GrpcReasonCategoryController } from './reason-category/grpc-reason-category.controller'
import { GrpcReasonController } from './reason/grpc-reason.controller'
import { GrpcReasonCategoryService } from './reason-category/grpc-reason-category.service'
import { GrpcReasonService } from './reason/grpc-reason-service'

@Module({
  imports: [ReasonModule],
  controllers: [GrpcReasonCategoryController, GrpcReasonController],
  providers: [GrpcReasonCategoryService, GrpcReasonService],
})
export class GrpcReasonModule {}
