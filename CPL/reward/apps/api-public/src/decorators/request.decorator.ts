import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { IRequestWithUserId } from '../interfaces/request-with-user-id'

export const UserId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request: IRequestWithUserId = ctx.switchToHttp().getRequest()
  return request.userId
})
