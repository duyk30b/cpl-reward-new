import {
  DeleteObjectCommand,
  GetObjectCommand,
  GetObjectRequest,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3'
import { Injectable, Logger } from '@nestjs/common'

import { BusinessException, randomString, UploadFileError } from '@lib/util'
import { ConfigService } from '@nestjs/config'

import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { LogService } from '@lib/log'
import { IRequestAdminActionLog } from '@lib/log/interfaces/admin-action-log.interface'
import { IOtherDataForUpload } from '@lib/upload-file/upload-file.interface'

const streamToString = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = []
    stream.on('data', (chunk) => chunks.push(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
  })

@Injectable()
export class UploadFileService {
  private readonly logger = new Logger(UploadFileService.name)
  private readonly region: string
  private readonly s3Client: S3Client
  // private bucket: string

  constructor(
    private readonly configService: ConfigService,
    private readonly logService: LogService,
  ) {
    this.region = this.configService.get('upload_file.s3_region')
    const accessKeyId = this.configService.get('upload_file.s3_api_key')
    const secretAccessKey = this.configService.get('upload_file.s3_api_secret')

    // this.bucket = this.configService.get('upload_file.s3_bucket')

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    })
  }

  async uploadForBce(
    file: Express.Multer.File,
    folderPath = undefined,
    otherData: IOtherDataForUpload,
    uploadFileName = undefined,
  ) {
    const bucket = this.configService.get('upload_file.s3_bce_icon_bucket')
    return this.upload(file, folderPath, otherData, uploadFileName, bucket)
  }

  async upload(
    file: Express.Multer.File,
    folderPath = undefined,
    otherData: IOtherDataForUpload,
    uploadFileName?: string,
    bucket?: string,
  ) {
    const currentBucket =
      bucket || this.configService.get('upload_file.s3_bucket')
    let key
    const fileName =
      new Date().getTime().toString().substring(0, 11) +
      '-' +
      randomString(5) +
      '-' +
      (uploadFileName === undefined ? file.originalname : uploadFileName)
    if (folderPath !== undefined) {
      key = `${folderPath}/${fileName}`
    } else {
      key = fileName
    }

    const params = {
      Key: key,
      Bucket: currentBucket,
      Body: file.buffer,
      ContentType: file.mimetype,
    }

    const command = new PutObjectCommand(params)

    let requestLog: IRequestAdminActionLog

    const now = Date.now()

    requestLog = {
      adminId: otherData.adminId,
      ip: otherData.ip,
      endpoint: `${currentBucket}.${this.region}.amazonaws.com`,
      method: 'POST',
      request: JSON.stringify({
        Key: key,
        Bucket: currentBucket,
        ContentType: file.mimetype,
      }),
      response: '',
      statusCode: 200,
    }
    requestLog = await this.logService.requestLog(requestLog)

    try {
      await this.s3Client.send(command)
      const result = {
        name: fileName,
        key,
        host: `${currentBucket}.${this.region}.amazonaws.com`,
        url: this.getForeverUrl(key, currentBucket),
      }

      const log = await this.logService.responseLog({
        ...requestLog,
        timeProcessed: Date.now() - now,
        response: JSON.stringify(result),
      })

      return {
        ...result,
        adminActionId: log.id,
        adminId: otherData.adminId,
      }
    } catch (error) {
      this.logger.error(error)
      throw new BusinessException(UploadFileError.UPLOAD_FAIL)
    }
  }

  async uploadToBucket(
    file: Express.Multer.File,
    folderPath = undefined,
    bucket: string,
  ) {
    let key
    const fileName =
      new Date().getTime() +
      '-' +
      randomString(10) +
      file.originalname.slice(-50).replace(/[^a-zA-Z0-9.]/g, '')
    if (folderPath) {
      key = `${folderPath}/${fileName}`
    } else {
      key = fileName
    }

    const params: PutObjectCommandInput = {
      Key: key,
      Bucket: bucket,
      Body: file.buffer,
      ContentType: file.mimetype,
    }

    const command = new PutObjectCommand(params)

    try {
      await this.s3Client.send(command)

      return {
        key,
        host: `${bucket}.${this.region}.amazonaws.com`,
        url: this.getForeverUrl(key, bucket),
      }
    } catch (error) {
      this.logger.error(error)
      throw new BusinessException(UploadFileError.UPLOAD_FAIL)
    }
  }

  /**
   *
   * @param fileKey string
   * @param expiresIn number
   * @param bucket
   * @param fileName
   */
  async getPublicUrl(
    fileKey: string,
    expiresIn = undefined,
    fileName?: string,
    bucket?: string,
  ) {
    const params: GetObjectRequest = {
      Key: fileKey,
      Bucket: bucket || this.configService.get('upload_file.s3_bucket'),
    }

    if (fileName) {
      const fileNameEncoded = encodeURI(fileName)
      params.ResponseContentDisposition = `attachment; filename=${fileNameEncoded}`
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

  getForeverUrl(fileKey: string, bucket?: string) {
    return `https://${
      bucket || this.configService.get('upload_file.s3_bucket')
    }.s3.${this.region}.amazonaws.com/${fileKey}`
  }

  async delete(fileKey: string, bucket?: string) {
    const params = {
      Key: fileKey,
      Bucket: bucket || this.configService.get('upload_file.s3_bucket'),
    }

    const command = new DeleteObjectCommand(params)

    try {
      return await this.s3Client.send(command)
    } catch (error) {
      this.logger.error(error)
      return null
    }
  }

  async readObjectData(fileKey: string, bucket?: string) {
    const params = {
      Key: fileKey,
      Bucket: bucket || this.configService.get('upload_file.s3_bucket'),
    }

    const command = new GetObjectCommand(params)
    try {
      const response = await this.s3Client.send(command)

      const { Body } = response

      return streamToString(Body)
    } catch (error) {
      this.logger.error(error)
      return null
    }
  }

  async readBodyObjectData(fileKey: string, bucket?: string) {
    const params = {
      Key: fileKey,
      Bucket: bucket || this.configService.get('upload_file.s3_bucket'),
    }

    const command = new GetObjectCommand(params)
    try {
      const response = await this.s3Client.send(command)

      const { Body } = response

      return Body
    } catch (error) {
      this.logger.error(error)
      return null
    }
  }
}
