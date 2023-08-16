import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
  ValidationError,
} from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { Request, Response } from 'express'

export class ValidationException extends Error {
  private readonly errors: ValidationError[]
  constructor(validationErrors: ValidationError[] = []) {
    super()
    this.errors = validationErrors
  }

  getMessage() {
    return this.message
  }

  getErrors() {
    return this.errors
  }
}

@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter {
  async catch(exception: ValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = HttpStatus.BAD_REQUEST
    const msg = exception.getMessage()
    const errors = exception.getErrors()

    response.status(status).json({
      statusCode: status,
      msg,
      errors,
      timestamp: new Date().toISOString(),
      path: request.url,
    })
  }
}

@Catch(ValidationException)
export class GrpcValidateExceptionFilter implements ExceptionFilter {
  private logger = new Logger(GrpcValidateExceptionFilter.name)

  catch(exception: ValidationException) {
    const err = JSON.stringify(exception.getErrors())
    this.logger.error(err)
    throw new RpcException(err)
  }
}
