import { classToPlain } from 'class-transformer'

export class ResponseDto {
  success: boolean
  message?: string
  data?: any

  constructor(data?: any, message?: string) {
    this.data = data ? classToPlain(data, { ignoreDecorators: true }) : null
    this.success = true
    this.message = message ? message : null
  }

  error(message?: string) {
    this.success = false
    this.message = message ? message : ''
    this.data = null
    return this
  }
}
