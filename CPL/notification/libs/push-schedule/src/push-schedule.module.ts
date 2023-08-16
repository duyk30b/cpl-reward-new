import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PushSchedule } from './push-schedule.entity'
import { PushScheduleService } from './push-schedule.service'

@Module({
  imports: [TypeOrmModule.forFeature([PushSchedule])],
  providers: [PushScheduleService],
  exports: [PushScheduleService],
})
export class PushScheduleModule {}
