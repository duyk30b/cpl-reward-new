import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import amazonRekognitionConfig from './amazon-rekognition.config'
import { AmazonRekognitionService } from './amazon-rekognition.service'

@Module({
  imports: [ConfigModule.forFeature(amazonRekognitionConfig)],
  providers: [AmazonRekognitionService],
  exports: [AmazonRekognitionService],
})
export class AmazonRekognitionModule {}
