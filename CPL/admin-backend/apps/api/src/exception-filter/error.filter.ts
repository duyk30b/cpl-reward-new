import { ValidationException } from '@lib/util'
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common'
import { Request, Response } from 'express'

@Catch(Error)
export class ErrorFilter implements ExceptionFilter {
  logger = new Logger(ErrorFilter.name)
  catch(exception: Error, host: ArgumentsHost) {
    if (
      !(exception instanceof ValidationException) &&
      !(exception instanceof HttpException)
    ) {
      this.logger.debug(exception.message)
      const ctx = host.switchToHttp()
      const response = ctx.getResponse<Response>()
      const request = ctx.getRequest<Request>()
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.message,
        timestamp: new Date().toISOString(),
        path: request.url,
      })
    }
  }
}
