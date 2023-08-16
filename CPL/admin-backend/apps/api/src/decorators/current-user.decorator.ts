import { IAccessTokenPayload } from '@lib/authorization/interfaces/access-token-payload.interface'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const TokenInformation = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return request.accessTokenInfo as IAccessTokenPayload
  },
)
