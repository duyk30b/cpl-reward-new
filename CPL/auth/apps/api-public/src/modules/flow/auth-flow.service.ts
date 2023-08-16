import { BadRequestException, Injectable } from '@nestjs/common'
import { FlowAction, FlowStatus } from '@lib/flows/enum/flows.enum'
import { CreateFlowDto } from '@lib/flows/dto/create-flow.dto'
import { FlowService } from '@lib/flows'
import { v4 as uuidv4 } from 'uuid'
import { IFlowData } from '@lib/flows/interfaces/flow-data.interface'
import { BusinessException } from '@lib/util'
import { FlowsError } from '@lib/util'
import { Flow } from '@lib/flows/entities/flow.entity'
import { UploadFileService } from '@lib/upload-file'
import { FileService } from '@lib/upload-file'

@Injectable()
export class AuthFlowService {
  constructor(
    private readonly flowService: FlowService,
    private readonly uploadFileService: UploadFileService,
    private readonly fileService: FileService,
  ) {}

  async getFlow(action: string, userId: string) {
    if (!FlowAction[action]) {
      throw new BadRequestException()
    }

    const existingFlow = await this.flowService.getPendingFlow(action, userId)

    if (existingFlow) {
      return this.addFileToFlowData(existingFlow, userId)
    }
    // Create and return new flow
    const newFlow = new CreateFlowDto()
    newFlow.action = FlowAction[action]
    newFlow.status = FlowStatus.RUNNING
    newFlow.uuid = uuidv4()
    return this.flowService.create(newFlow, userId)
  }

  async addFlowData(flowUuid: string, userId: string, flowData: IFlowData) {
    const flow = await this.flowService.getFlowByUuid(flowUuid)
    if (flow.userId != userId) {
      throw new BusinessException(FlowsError.NOT_FOUND)
    }

    await this.flowService.addFlowData(flow, flowData)
  }

  async addFileToFlowData(flow: Flow, userId: string) {
    const fileIds = flow.flowData.fileIds || []
    const fileMap = {}
    const fileEntities = await this.fileService.getUploadedFilesByIds(fileIds)
    for (let i = 0; i < fileEntities.length; i++) {
      const fileEntity = fileEntities[i]
      if (fileEntity.userId != userId) continue
      const url = await this.uploadFileService.getPublicUrl(fileEntity.name)
      fileMap[fileEntity.id] = url
    }
    flow.flowData['file_map'] = fileMap
    return flow
  }
}
