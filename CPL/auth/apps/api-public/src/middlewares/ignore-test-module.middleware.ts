import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request } from 'express'
import { TestService } from '../modules/test/test.service'
import { BusinessException } from '@lib/util'
const ENV = process.env.ENV

@Injectable()
export class IgnoreTestModuleMiddleware implements NestMiddleware {
  constructor(private testService: TestService) {}

  async use(req: Request, res: Response, next: () => void) {
    if (ENV !== 'local') {
      throw new BusinessException({
        code: 404,
        message: 'TEST_MODULE_NOT_FOUND',
      })
    }
    next()
  }
}
