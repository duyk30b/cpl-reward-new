import { Module } from '@nestjs/common'
import { FlowService } from './services/flow.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Flow } from './entities/flow.entity'
import { ConfigModule } from '@nestjs/config'
import { FlowLog } from './entities/flow-log.entity'
import { FlowLogsService } from './services/flow-logs.service'

@Module({
  imports: [TypeOrmModule.forFeature([Flow, FlowLog]), ConfigModule.forRoot()],
  providers: [FlowService, FlowLogsService],
  exports: [FlowService, FlowLogsService],
})
export class FlowsModule {}
