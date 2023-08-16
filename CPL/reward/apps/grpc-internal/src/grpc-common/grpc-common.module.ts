import { Module } from '@nestjs/common'
import { GrpcCommonController } from './grpc-common.controller'

@Module({
  imports: [],
  controllers: [GrpcCommonController],
  providers: [],
})
export class GrpcCommonModule {}
