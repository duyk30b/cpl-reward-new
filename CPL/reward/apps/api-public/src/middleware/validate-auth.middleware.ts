import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction } from 'express'
import { IRequestWithUserId } from '../interfaces/request-with-user-id'

@Injectable()
export class ValidateAuthMiddleware implements NestMiddleware {
  async use(req: IRequestWithUserId, res: Response, next: NextFunction) {
    if (['local', 'dev'].includes(process.env.ENV)) {
      if (process.env.FAKE_USER_ID) {
        req.userId = String(process.env.FAKE_USER_ID)
        return next()
      }
    }

    const xBceRole = req.header('X-BCE-ROLE') || null
    const xBceUid = req.header('X-BCE-UID') || null

    if (xBceUid === null || xBceRole === null || xBceRole === 'guest') {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED)
    }

    req.userId = String(xBceUid)
    next()
  }
}
