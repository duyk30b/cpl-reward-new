import { BadRequestException } from '@nestjs/common'

export class QueryException extends BadRequestException {
  constructor() {
    super('QueryException')
  }
}
