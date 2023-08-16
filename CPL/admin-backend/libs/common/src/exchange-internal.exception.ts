import { BadRequestException } from '@nestjs/common'

export class ExchangeInternalException extends BadRequestException {
  constructor(msg: string) {
    super(msg)
  }
}
