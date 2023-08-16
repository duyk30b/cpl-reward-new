import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import {
  RekognitionIndex,
  RekognitionInfo,
  RekognitionInfoHistory,
  RekognitionRelatedFace,
  RekognitionResponse,
} from './entities'
import { RekognitionIndexService } from './services/rekognition-index.service'
import { RekognitionInfoHistoryService } from './services/rekognition-info-history.service'
import { RekognitionInfoService } from './services/rekognition-info.service'
import { RekognitionRelatedFaceService } from './services/rekognition-related-face.service'
import { RekognitionResponseService } from './services/rekognition-response.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RekognitionInfo,
      RekognitionResponse,
      RekognitionRelatedFace,
      RekognitionInfoHistory,
      RekognitionIndex,
    ]),
  ],
  providers: [
    RekognitionInfoService,
    RekognitionInfoHistoryService,
    RekognitionRelatedFaceService,
    RekognitionResponseService,
    RekognitionIndexService,
  ],
  exports: [
    RekognitionInfoService,
    RekognitionInfoHistoryService,
    RekognitionRelatedFaceService,
    RekognitionResponseService,
    RekognitionIndexService,
  ],
})
export class UserKycRekognitionModule {}
