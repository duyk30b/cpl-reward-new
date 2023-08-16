import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RekognitionResponse } from '../entities'
import { IUpdateRekognitionResponse } from '../interfaces/rekognition-response.interface'

@Injectable()
export class RekognitionResponseService {
  constructor(
    @InjectRepository(RekognitionResponse)
    private readonly rekognitionResponseRepository: Repository<RekognitionResponse>,
  ) {}

  async findByRekognitionInfoHistoryId(rekognitionInfoHistoryId: string) {
    return await this.rekognitionResponseRepository.findOne({
      rekognitionInfoHistoryId: rekognitionInfoHistoryId,
    })
  }

  async upsertRekognitionResponse(
    rekognitionInfoHistoryId: string,
    updateDto: IUpdateRekognitionResponse,
  ) {
    const existed = await this.rekognitionResponseRepository.findOne({
      rekognitionInfoHistoryId,
    })
    if (!existed) {
      await this.rekognitionResponseRepository.save({
        rekognitionInfoHistoryId,
        ...updateDto,
      })
    }
    await this.rekognitionResponseRepository.update(
      { rekognitionInfoHistoryId },
      updateDto,
    )
  }
}
