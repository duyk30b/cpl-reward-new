import { HttpStatus, ValidationError } from '@nestjs/common'
import { AuthValidationError } from '../formatter/error'

export class ValidationException extends Error {
  private readonly errors: ValidationError[]
  constructor(validationErrors: ValidationError[] = []) {
    super(AuthValidationError.FAIL)
    this.errors = validationErrors
  }

  getMessage() {
    return this.message
  }

  getStatus() {
    return HttpStatus.BAD_REQUEST
  }

  getErrors() {
    return this.errors
  }
}
