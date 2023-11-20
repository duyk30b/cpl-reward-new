import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'
import { Request, Response } from 'express'

export class BusinessException extends Error {
  private readonly response: { code?: number; message?: string }
  private readonly statusCode: number
  private readonly httpStatus: number

  constructor(
    response: { code: number; message: string },
    httpStatus: number = HttpStatus.BAD_REQUEST,
  ) {
    super()
    this.response = response || {}
    this.statusCode = this.response.code
    this.message = this.response.message
    this.httpStatus = httpStatus
  }

  getMessage() {
    return this.message
  }

  getStatusCode() {
    return this.statusCode
  }

  getHttpStatus() {
    return this.httpStatus
  }
}

@Catch(BusinessException)
export class BusinessExceptionFilter implements ExceptionFilter {
  async catch(exception: BusinessException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const statusCode = exception.getStatusCode()
    const httpStatus = exception.getHttpStatus()
    const msg = exception.getMessage()

    response.status(httpStatus).json({
      statusCode,
      msg,
      timestamp: new Date().toISOString(),
      path: request.url,
    })
  }
}
