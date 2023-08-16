import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common'
import { BusinessException } from '../exceptions'
import { IRequestWithToken } from '../interfaces/request.interface'
import { Role, TokenError } from '../variables'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: IRequestWithToken, res: Response, next: () => void) {
    const role = req.header('x-bce-role')
    const userId = req.header('x-bce-uid')
    const jwt: string = req.header('x-bce-jwt') || ''

    if (role != Role.USER || !userId) {
      throw new BusinessException(TokenError.INVALID, HttpStatus.UNAUTHORIZED)
    }

    const tokenPayload = jwt.split('.')[1]
    const tokenPayloadData = JSON.parse(
      Buffer.from(tokenPayload, 'base64').toString(),
    )

    if (!tokenPayloadData.device) {
      throw new BusinessException(TokenError.INVALID, HttpStatus.UNAUTHORIZED)
    }

    req.tokenInfo = { userId, deviceId: tokenPayloadData.device }

    next()
  }
}
