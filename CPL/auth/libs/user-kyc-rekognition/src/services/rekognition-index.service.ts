import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RekognitionIndex } from '../entities'
import { ICreateRekognitionIndex } from '../interfaces/rekognition-index.interface'

@Injectable()
export class RekognitionIndexService {
  constructor(
    @InjectRepository(RekognitionIndex)
    private readonly rekognitionIndexRepository: Repository<RekognitionIndex>,
  ) {}

  async create(rekognitionIndexDto: ICreateRekognitionIndex) {
    const existed = await this.rekognitionIndexRepository.findOne({
      faceId: rekognitionIndexDto.faceId,
    })
    if (existed) return existed
    const index = new RekognitionIndex()
    index.faceId = rekognitionIndexDto.faceId
    index.sampleImage = rekognitionIndexDto.sampleImage
    index.sampleIndexResponse = rekognitionIndexDto.sampleIndexResponse
    return await this.rekognitionIndexRepository.save(index)
  }

  async findOneByFaceId(faceId: string) {
    return await this.rekognitionIndexRepository.findOne({ faceId })
  }
}
