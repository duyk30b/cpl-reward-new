import { ImportFileModule } from '@app/import-file'
import { AdminModule } from '@lib/admin'
import { RolePermissionModule } from '@lib/role-permission'
import { Module } from '@nestjs/common'
import { ApiImportExcelController } from './api-import-excel.controller'
@Module({
  imports: [ImportFileModule, RolePermissionModule, AdminModule],
  controllers: [ApiImportExcelController],
  providers: [],
})
export class ApiImportExcelModule {}
