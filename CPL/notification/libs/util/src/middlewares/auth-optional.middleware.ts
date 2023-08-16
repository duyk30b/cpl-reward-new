import { Injectable, NestMiddleware } from '@nestjs/common'
import { IRequestWithToken } from '../interfaces/request.interface'
import { Role } from '../variables'

@Injectable()
export class AuthOptionalMiddleware implements NestMiddleware {
  async use(req: IRequestWithToken, res: Response, next: () => void) {
    const role = req.header('x-bce-role')
    const userId = req.header('x-bce-uid')
    const jwt: string = req.header('x-bce-jwt') || ''

    let deviceId = null
    if (jwt) {
      const tokenPayload = jwt.split('.')[1]
      const tokenPayloadData = JSON.parse(
        Buffer.from(tokenPayload, 'base64').toString(),
      )
      deviceId = tokenPayloadData.device
    }

    if (role != Role.USER || !userId) {
      req.tokenInfo = { userId: null, deviceId }
    } else {
      req.tokenInfo = { userId, deviceId }
    }

    next()
  }
}
