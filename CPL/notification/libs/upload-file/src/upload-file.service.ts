import { Injectable, Logger } from '@nestjs/common'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

import { ConfigService } from '@nestjs/config'

@Injectable()
export class UploadFileService {
  private readonly logger = new Logger(UploadFileService.name)
  private readonly region: string
  private readonly s3Client
  private readonly bucket

  constructor(private readonly configService: ConfigService) {
    this.region = this.configService.get('upload_file.s3_region')
    const accessKeyId = this.configService.get('upload_file.s3_api_key')
    const secretAccessKey = this.configService.get('upload_file.s3_api_secret')

    this.bucket = this.configService.get('upload_file.s3_bucket')

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    })
  }

  async uploadBuffer(buffer: Buffer, fileName: string) {
    const params = {
      Key: fileName,
      Bucket: this.bucket,
      Body: buffer,
    }

    const command = new PutObjectCommand(params)

    try {
      await this.s3Client.send(command)
      return {
        key: fileName,
        host: `${this.bucket}.${this.region}.amazonaws.com`,
        url: this.getForeverUrl(fileName),
      }
    } catch (error) {
      this.logger.error(error)
    }
  }

  getForeverUrl(fileKey: string, bucket?: string) {
    return `https://${bucket || this.bucket}.s3.${
      this.region
    }.amazonaws.com/${fileKey}`
  }
}
