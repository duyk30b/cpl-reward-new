import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common'
import { Request, Response } from 'express'
import { BusinessException } from '@libs/util'

@Catch(BusinessException)
export class BusinessExceptionFilter implements ExceptionFilter {
  async catch(exception: BusinessException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus()
    const httpStatus = exception.getHttpStatus()
    const msg = exception.getMessage()

    response.status(httpStatus).json({
      statusCode: status,
      msg: msg,
      timestamp: new Date().toISOString(),
      path: request.url,
    })
  }
}
