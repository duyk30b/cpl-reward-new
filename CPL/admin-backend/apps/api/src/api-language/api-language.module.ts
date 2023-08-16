import { AdminModule } from '@lib/admin'
import { AuthorizationModule } from '@lib/authorization'
import { RolePermissionModule } from '@lib/role-permission'
import { Module } from '@nestjs/common'
import { AbilityModule } from '../ability/ability.module'
import { ApiLanguageController } from './api-language.controller'
import { ApiLanguageService } from './api-language.service'
import { UploadFileModule } from '@lib/upload-file'
import { LanguageSettingModule } from '@lib/grpc-client/common-setting/language-setting/language-setting.module'
import { QueueModule } from '@lib/queue'
import { ApiLanguageProcessor } from './api-language.processor'

@Module({
  imports: [
    LanguageSettingModule,
    AuthorizationModule,
    AdminModule,
    RolePermissionModule,
    AbilityModule,
    UploadFileModule,
    QueueModule,
  ],
  providers: [ApiLanguageService, ApiLanguageProcessor],
  controllers: [ApiLanguageController],
})
export class ApiLanguageModule {}
