import { AmazonRekognitionService } from '@lib/amazon-rekognition'
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Command } from 'nest-commander'

@Command({ name: 'remove:face-index' })
export class RemoveFaceIndexService {
  private readonly logger = new Logger(RemoveFaceIndexService.name)
  private readonly kycFaceCollection: string
  constructor(
    private readonly amazonRekognitionService: AmazonRekognitionService,
    private readonly configService: ConfigService,
  ) {
    this.kycFaceCollection = this.configService.get(
      'kyc.rekognition_face_collection',
    )
  }

  async run(passedParam: string[]): Promise<void> {
    if (!passedParam.length) return
    for (const faceId of passedParam) {
      const res = await this.amazonRekognitionService.deleteFaceFromCollection(
        faceId,
        this.kycFaceCollection,
      )
      // eslint-disable-next-line no-console
      console.dir(res, { depth: null, colors: true })
    }
  }
}
