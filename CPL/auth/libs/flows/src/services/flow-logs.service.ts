import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateFlowLogDto } from '../dto/create-flow-log.dto'
import { FlowLog } from '../entities/flow-log.entity'

@Injectable()
export class FlowLogsService {
  constructor(
    @InjectRepository(FlowLog)
    private readonly flowLogRepository: Repository<FlowLog>,
  ) {}

  create(createFlowLogDto: CreateFlowLogDto) {
    const flowLog = new FlowLog()
    flowLog.flowId = createFlowLogDto.flowId
    flowLog.status = createFlowLogDto.status

    return this.flowLogRepository.save(flowLog)
  }
}
