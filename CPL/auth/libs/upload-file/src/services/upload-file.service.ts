import { Injectable, Logger } from '@nestjs/common'
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'

import { ConfigService } from '@nestjs/config'
import { randomString } from '@lib/util'
import { BusinessException } from '@lib/util'
import { UploadFileError } from '@lib/util'

import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

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

  async upload(file: Express.Multer.File) {
    const fileName =
      new Date().getTime().toString().substr(0, 11) +
      '-' +
      randomString(5) +
      (file.originalname || '').slice(0, 150)

    const params = {
      Key: fileName,
      Bucket: this.bucket,
      Body: file.buffer,
      ContentType: file.mimetype,
    }

    const command = new PutObjectCommand(params)

    try {
      await this.s3Client.send(command)
      return {
        name: fileName,
        host: `${this.bucket}.${this.region}.amazonaws.com`,
      }
    } catch (error) {
      this.logger.error(error)
      throw new BusinessException(UploadFileError.UPLOAD_FAIL)
    }
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
        name: fileName,
        host: `${this.bucket}.${this.region}.amazonaws.com`,
      }
    } catch (error) {
      this.logger.error(error)
      throw new BusinessException(UploadFileError.UPLOAD_FAIL)
    }
  }

  async getPublicUrl(fileKey: string, expiresIn = 3600) {
    const params = {
      Key: fileKey,
      Bucket: this.bucket,
    }

    const command = new GetObjectCommand(params)

    try {
      return await getSignedUrl(this.s3Client, command, {
        expiresIn,
      })
    } catch (error) {
      this.logger.error(error)
      return null
    }
  }

  async delete(fileKey: string) {
    const params = {
      Key: fileKey,
      Bucket: this.bucket,
    }

    const command = new DeleteObjectCommand(params)

    try {
      return await this.s3Client.send(command)
    } catch (error) {
      this.logger.error(error)
      return null
    }
  }
}
