import { Module } from '@nestjs/common'
import { ApiAdminService } from './api-admin.service'
import { ApiAdminController } from './api-admin.controller'
import { AdminModule } from '@lib/admin'
import { AbilityModule } from '../ability/ability.module'

@Module({
  imports: [AdminModule, AbilityModule],
  controllers: [ApiAdminController],
  providers: [ApiAdminService],
})
export class ApiAdminModule {}
