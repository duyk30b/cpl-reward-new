import { Injectable } from '@nestjs/common'
import { IAccessTokenPayload } from '@lib/authorization/interfaces/access-token-payload.interface'
import { AccessTokenService } from '@lib/authorization'

@Injectable()
export class TokenService {
  constructor(private readonly accessTokenService: AccessTokenService) {}

  grantAccessToken(accessTokenDto: IAccessTokenPayload) {
    return this.accessTokenService.create(accessTokenDto)
  }
}
