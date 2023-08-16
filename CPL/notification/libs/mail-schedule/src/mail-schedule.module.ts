import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MailSchedule } from './mail-schedule.entity'
import { MailScheduleService } from './mail-schedule.service'

@Module({
  imports: [TypeOrmModule.forFeature([MailSchedule])],
  providers: [MailScheduleService],
  exports: [MailScheduleService],
})
export class MailScheduleModule {}
