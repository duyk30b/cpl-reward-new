import { Injectable, Scope } from '@nestjs/common'
import {
  GetObjectCommand,
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
} from '@aws-sdk/client-s3'

import { ConfigService } from '@nestjs/config'
import { randomString } from '@lib/util'

import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

@Injectable({ scope: Scope.REQUEST })
export class MultipartUploaderService {
  private readonly region: string
  private readonly s3Client: S3Client
  private readonly bucket: string
  private fileKey: string
  private data = ''
  private uploadId: string
  private partNumber = 0
  private multipleParts: Array<{ ETag: string; PartNumber: number }> = []
  private readonly FILE_EXIST_DURATION = 3600
  private readonly S3_REQUIRE_SIZE = 5242880

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

  async getPublicUrl() {
    const params = {
      Key: this.fileKey,
      Bucket: this.bucket,
    }

    const command = new GetObjectCommand(params)

    try {
      return await getSignedUrl(this.s3Client, command, {
        expiresIn: this.FILE_EXIST_DURATION,
      })
    } catch (error) {
      throw error
    }
  }

  async createMultiplePartUpload(pathFolder: string, fileExtention: string) {
    this.fileKey =
      pathFolder +
      new Date().getTime().toString().substr(0, 11) +
      '-' +
      randomString(5) +
      '.' +
      fileExtention

    const params = {
      Bucket: this.bucket,
      Key: this.fileKey,
    }

    const command = new CreateMultipartUploadCommand(params)

    try {
      const result = await this.s3Client.send(command)
      this.uploadId = result.UploadId
    } catch (error) {
      throw error
    }
  }

  async uploadPart() {
    this.partNumber++

    const params = {
      Bucket: this.bucket,
      Key: this.fileKey,
      UploadId: this.uploadId,
      PartNumber: this.partNumber,
      Body: this.data,
    }

    const command = new UploadPartCommand(params)

    try {
      const result = await this.s3Client.send(command)
      this.multipleParts.push({
        ETag: result.ETag,
        PartNumber: this.partNumber,
      })
    } catch (error) {
      throw error
    }
  }

  async completeMultiplePartUpload() {
    const params = {
      Bucket: this.bucket,
      Key: this.fileKey,
      UploadId: this.uploadId,
      MultipartUpload: {
        Parts: this.multipleParts,
      },
    }

    const command = new CompleteMultipartUploadCommand(params)

    try {
      if (this.data) {
        await this.uploadPart()
      }

      await this.s3Client.send(command)
      return true
    } catch (error) {
      throw error
    }
  }

  async abortMultiplePartUpload() {
    const params = {
      Bucket: this.bucket,
      Key: this.fileKey,
      UploadId: this.uploadId,
    }

    const command = new AbortMultipartUploadCommand(params)

    try {
      await this.s3Client.send(command)
      return true
    } catch (error) {
      throw error
    }
  }

  async addData(data: string) {
    this.data += data

    if (this.data.length <= this.S3_REQUIRE_SIZE) {
      return true
    }

    try {
      await this.uploadPart()
      this.data = ''

      return true
    } catch (error) {
      throw error
    }
  }
}
