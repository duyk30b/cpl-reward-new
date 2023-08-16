import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { IAuthorizationCodePayload } from '../interfaces/authorization-code-payload.interface'

@Injectable()
export class AuthorizationCodeService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  create(authorizationCodePayload: IAuthorizationCodePayload, secret: string) {
    const payload = {
      iss: this.configService.get('iss'),
      app_id: authorizationCodePayload.appId,
      uid: authorizationCodePayload.userId,
      scopes: authorizationCodePayload.scopes,
    }

    return this.jwtService.sign(payload, {
      secret: secret,
      expiresIn: '3m',
    })
  }

  verify(authorizationCode: string, secret: string) {
    try {
      return this.jwtService.verify(authorizationCode, {
        secret: secret,
      })
    } catch (e) {
      return null
    }
  }
}
