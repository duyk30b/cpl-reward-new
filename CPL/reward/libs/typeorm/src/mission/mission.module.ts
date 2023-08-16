import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Mission } from './mission.entity'
import { MissionService } from './mission.service'

@Module({
  imports: [TypeOrmModule.forFeature([Mission])],
  providers: [MissionService],
  exports: [MissionService],
})
export class MissionModule {}
