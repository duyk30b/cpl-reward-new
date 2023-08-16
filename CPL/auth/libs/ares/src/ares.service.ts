import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { lastValueFrom, map, Observable, retryWhen } from 'rxjs'
import { HttpService } from '@nestjs/axios'
import { genericRetryStrategy } from '@lib/util'
import { getBufferFromUrl } from '@lib/util'

@Injectable()
export class AresService {
  private readonly logger = new Logger(AresService.name)

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async aresCompareOcr(selfie: string, document: string) {
    const url = this.configService.get('cynopsis.compare_api_url')

    const token = await this.generateToken()
    if (!token) {
      return null
    }

    // Image 1
    const faceBuffer = await getBufferFromUrl(selfie)
    // Image 2
    const documentBuffer = await getBufferFromUrl(document)

    const options = {
      method: 'POST',
      url: url,
      headers: {
        Authorization: 'Bearer ' + token,
      },
      formData: {
        file0: {
          value: faceBuffer,
          options: {
            filename: 'file0',
            contentType: null,
          },
        },
        file1: {
          value: documentBuffer,
          options: {
            filename: 'file1',
            contentType: null,
          },
        },
      },
    }

    const response = await this.promisifiedRequest(options)
    return response
  }

  async getOcrInfo(buffer: Buffer) {
    const url = this.configService.get('cynopsis.ocr_api_url')

    const token = await this.generateToken()
    if (!token) {
      return null
    }

    const options = {
      method: 'POST',
      url: url,
      headers: {
        Authorization: 'Bearer ' + token,
      },
      formData: {
        file0: {
          value: buffer,
          options: {
            filename: 'file0',
            contentType: null,
          },
        },
      },
    }

    const response = await this.promisifiedRequest(options)
    return response
  }

  // Dùng request vì chưa xác định được lỗi khi dùng HttpService
  async promisifiedRequest(options): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const request = require('request')
    try {
      const observable = new Observable((subscriber) => {
        request(options, (error, response) => {
          if (response) {
            subscriber.next(response)
            subscriber.complete()
          }
          if (error) {
            subscriber.error(error)
          }
        })
      })
      const response: any = await lastValueFrom(
        observable.pipe(retryWhen(genericRetryStrategy())),
      )
      return JSON.parse(response.body)
    } catch (e) {
      this.logger.debug(e)
      return null
    }
  }

  async generateToken() {
    const aresSecret = this.configService.get('cynopsis.ares_secret_token')
    const authUrl = this.configService.get('cynopsis.auth_url')
    try {
      const result = await lastValueFrom(
        this.httpService
          .post(authUrl, 'grant_type=client_credentials', {
            headers: {
              Authorization: 'Basic ' + aresSecret,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
          .pipe(map((response) => response.data)),
      )

      if (result) {
        return result.access_token
      }
    } catch (e) {
      return null
    }

    return null
  }
}
