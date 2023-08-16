import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RekognitionInfo } from '../entities'
import { IUpdateRekognitionInfo } from '../interfaces/rekognition-info.interface'

@Injectable()
export class RekognitionInfoService {
  constructor(
    @InjectRepository(RekognitionInfo)
    private readonly rekognitionInfoRepository: Repository<RekognitionInfo>,
  ) {}

  async upsertRekognitionInfo(
    userId,
    rekognitionInfoDto: IUpdateRekognitionInfo,
  ) {
    let record = await this.rekognitionInfoRepository.findOne({
      userId: userId,
    })
    if (!record) {
      record = new RekognitionInfo()
      record.userId = userId
    }
    record.image = rekognitionInfoDto.image
    record.faceId = rekognitionInfoDto.faceId
    return await this.rekognitionInfoRepository.save(record)
  }
}
