import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateFlowDto } from '../dto/create-flow.dto'
import { Flow } from '../entities/flow.entity'
import { FlowStatus, FlowAction } from '../enum/flows.enum'
import { plainToClass } from 'class-transformer'
import { IFlowData } from '../interfaces/flow-data.interface'

@Injectable()
export class FlowService {
  constructor(
    @InjectRepository(Flow)
    private readonly flowRepository: Repository<Flow>,
  ) {}

  create(createFlowDto: CreateFlowDto, userId: string) {
    const newFlow = plainToClass(
      Flow,
      { ...createFlowDto, userId: userId },
      {
        exposeUnsetFields: false,
      },
    )
    return this.flowRepository.save(newFlow)
  }

  getFlowByUuid(uuid: string) {
    return this.flowRepository.findOne({ uuid: uuid })
  }

  async addFlowData(flow: Flow, additionFlowData: IFlowData) {
    flow.flowData = { ...flow.flowData, ...additionFlowData }
    return await this.flowRepository.save(flow)
  }

  async getPendingFlow(action: string, userId: string) {
    const pendingFlow = await this.flowRepository.findOne({
      where: {
        action: FlowAction[action],
        userId: userId,
        status: FlowStatus.RUNNING,
      },
    })
    return pendingFlow
  }

  async completeFlow(action: FlowAction, userId: string) {
    await this.flowRepository.update(
      { action, userId },
      { status: FlowStatus.COMPLETED },
    )
  }
}
