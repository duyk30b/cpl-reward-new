import { Module } from '@nestjs/common'
import { AuthFlowService } from './auth-flow.service'
import { AuthFlowController } from './auth-flow.controller'
import { FlowsModule } from '@lib/flows'
import { DeviceModule } from '@lib/device'
import { UserModule } from '@lib/user'
import { UploadFileModule } from '@lib/upload-file'

@Module({
  imports: [FlowsModule, DeviceModule, UserModule, UploadFileModule],
  controllers: [AuthFlowController],
  providers: [AuthFlowService],
})
export class AuthFlowModule {}
