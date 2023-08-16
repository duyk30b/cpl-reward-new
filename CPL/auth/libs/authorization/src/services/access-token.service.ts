import { HttpStatus, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { IAccessTokenPayload } from '../interfaces/access-token-payload.interface'
import * as fs from 'fs'
import { join } from 'path'
import { BusinessException } from '@lib/util'
import { TokenError } from '@lib/util'

@Injectable()
export class AccessTokenService {
  private publicKey: string
  private privateKey: string
  private readonly logger = new Logger('access_token')

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.publicKey = fs
      .readFileSync(
        join(
          this.configService.get('jwt_key_dir'),
          this.configService.get('access_jwt_public_key'),
        ),
      )
      .toString()
    this.privateKey = fs
      .readFileSync(
        join(
          this.configService.get('jwt_key_dir'),
          this.configService.get('access_jwt_private_key'),
        ),
      )
      .toString()
  }

  create(accessTokenPayload: IAccessTokenPayload) {
    const payload = {
      iss: this.configService.get('iss'),
      app_id: accessTokenPayload.appId,
      device: accessTokenPayload.deviceId,
      uid: accessTokenPayload.userId,
      scopes: accessTokenPayload.scopes,
    }

    return this.jwtService.sign(payload, {
      privateKey: this.privateKey,
      expiresIn: this.configService.get('access_jwt_exp'),
    })
  }

  verify(accessToken: string) {
    try {
      return this.jwtService.verify(accessToken, {
        publicKey: this.publicKey,
      })
    } catch (e) {
      // this.logger.debug(e)
      if (e.name == 'TokenExpiredError') {
        throw new BusinessException(TokenError.EXPIRED, HttpStatus.UNAUTHORIZED)
      } else {
        throw new BusinessException(TokenError.INVALID, HttpStatus.UNAUTHORIZED)
      }
    }
  }
}
