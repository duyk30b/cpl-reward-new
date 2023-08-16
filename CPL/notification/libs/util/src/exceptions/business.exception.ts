import { HttpStatus } from '@nestjs/common'

export class BusinessException extends Error {
  private readonly response
  private readonly status: number
  private readonly httpStatus: number

  constructor(
    response: { code: number; message: string },
    httpStatus: number = HttpStatus.BAD_REQUEST,
  ) {
    super()
    this.response = response || {}
    this.status = this.response.code
    this.message = this.response.message
    this.httpStatus = httpStatus
    this.initName()
  }

  initName() {
    this.name = this.constructor.name
  }

  getResponse() {
    return this.response
  }

  getMessage() {
    return this.message
  }

  getStatus() {
    return this.status
  }

  getHttpStatus() {
    return this.httpStatus
  }
}
