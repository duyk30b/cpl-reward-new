import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AdminActionLog } from './entities/admin-action-log.entity'
import { LogService } from './log.service'

@Module({
  imports: [TypeOrmModule.forFeature([AdminActionLog])],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
