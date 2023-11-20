import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CheckInLog } from './checkin-log.entity'
import { CheckInLogService } from './checkin-log.service'

@Module({
  imports: [TypeOrmModule.forFeature([CheckInLog])],
  providers: [CheckInLogService],
  exports: [CheckInLogService],
})
export class CheckInLogModule {}
