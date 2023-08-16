import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MissionEvent } from './mission-event.entity'
import { MissionEventService } from './mission-event.service'

@Module({
  imports: [TypeOrmModule.forFeature([MissionEvent])],
  providers: [MissionEventService],
  exports: [MissionEventService],
})
export class MissionEventModule {}
