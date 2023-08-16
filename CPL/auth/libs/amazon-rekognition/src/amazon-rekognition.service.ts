import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  CompareFacesCommand,
  CreateCollectionCommand,
  DeleteFacesCommand,
  DescribeCollectionCommand,
  IndexFacesCommand,
  RekognitionClient,
  SearchFacesCommand,
} from '@aws-sdk/client-rekognition'

@Injectable()
export class AmazonRekognitionService {
  private readonly logger = new Logger(AmazonRekognitionService.name)
  private readonly region: string
  private readonly client: RekognitionClient
  private readonly bucket: string

  constructor(private readonly configService: ConfigService) {
    this.region = this.configService.get('amazon_rekognition.region')
    const accessKeyId = this.configService.get('amazon_rekognition.api_key')
    const secretAccessKey = this.configService.get(
      'amazon_rekognition.api_secret',
    )

    this.bucket = this.configService.get('amazon_rekognition.bucket')

    this.client = new RekognitionClient({
      region: this.region,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    })
  }

  async createCollectionIfNotExist(name: string) {
    try {
      await this.describeCollection(name)
    } catch (e) {
      this.logger.error(e, e.stack)
      await this.client.send(
        new CreateCollectionCommand({ CollectionId: name }),
      )
      await this.describeCollection(name)
    }
  }

  async describeCollection(name: string) {
    const response = await this.client.send(
      new DescribeCollectionCommand({ CollectionId: name }),
    )
    this.logger.log(`Collection Arn: ${response.CollectionARN}`)
    this.logger.log(`Face Count: ${response.FaceCount}`)
    this.logger.log(`Face Model Version: ${response.FaceModelVersion}`)
    this.logger.log(`Timestamp: ${response.CreationTimestamp}`)
    return response
  }

  async compareFaces(
    sourceS3ImageName: string,
    targetS3ImageName: string,
    similarityThreshold = 90,
  ) {
    return await this.client.send(
      new CompareFacesCommand({
        SourceImage: {
          S3Object: {
            Bucket: this.bucket,
            Name: sourceS3ImageName,
          },
        },
        TargetImage: {
          S3Object: {
            Bucket: this.bucket,
            Name: targetS3ImageName,
          },
        },
        SimilarityThreshold: similarityThreshold,
      }),
    )
  }

  async addFaceToCollection(
    s3ImageName: string,
    collection: string,
    maxFaces = 1,
  ) {
    return await this.client.send(
      new IndexFacesCommand({
        CollectionId: collection,
        Image: {
          S3Object: {
            Bucket: this.bucket,
            Name: s3ImageName,
          },
        },
        DetectionAttributes: ['DEFAULT'],
        MaxFaces: maxFaces,
        QualityFilter: 'AUTO',
      }),
    )
  }

  async findRelatedFace(
    faceId: string,
    collection: string,
    maxFaces = 5,
    faceMatchThreshold = 90,
  ) {
    return await this.client.send(
      new SearchFacesCommand({
        CollectionId: collection,
        FaceId: faceId,
        MaxFaces: maxFaces,
        FaceMatchThreshold: faceMatchThreshold,
      }),
    )
  }

  async deleteFaceFromCollection(faceId: string, collection: string) {
    return await this.client.send(
      new DeleteFacesCommand({
        CollectionId: collection,
        FaceIds: [faceId],
      }),
    )
  }
}
