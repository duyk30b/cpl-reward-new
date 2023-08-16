import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common'
import { ValidationException } from '@lib/util'
import { Request, Response } from 'express'
import { flattenErrors } from '@app/common'

export declare interface CustomValidationError {
  property: string
  msg: string
}

@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter {
  async catch(exception: ValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus()
    const msg = exception.getMessage()
    const errors = exception.getErrors()

    response.status(status).json({
      status_code: status,
      message: msg,
      errors: flattenErrors(errors),
      timestamp: new Date().toISOString(),
      path: request.url,
    })
  }
}
