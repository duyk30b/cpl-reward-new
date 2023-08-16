import { HttpStatus, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { IRefreshTokenPayload } from '../interfaces/refresh-token-payload.interface'
import * as fs from 'fs'
import { join } from 'path'
import { BusinessException } from '@lib/util'
import { TokenError } from '@lib/util'

@Injectable()
export class RefreshTokenService {
  private publicKey: string
  private privateKey: string
  private readonly logger = new Logger('refresh_token')

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.publicKey = fs
      .readFileSync(
        join(
          this.configService.get('jwt_key_dir'),
          this.configService.get('refresh_jwt_public_key'),
        ),
      )
      .toString()
    this.privateKey = fs
      .readFileSync(
        join(
          this.configService.get('jwt_key_dir'),
          this.configService.get('refresh_jwt_private_key'),
        ),
      )
      .toString()
  }

  create(refreshTokenPayload: IRefreshTokenPayload) {
    const payload = {
      iss: this.configService.get('iss'),
      app_id: refreshTokenPayload.appId,
      uid: refreshTokenPayload.uid,
      scopes: refreshTokenPayload.scopes,
    }

    const exp = parseInt(this.configService.get('refresh_jwt_exp'))
    return this.jwtService.sign(payload, {
      privateKey: this.privateKey,
      expiresIn: exp,
    })
  }

  verify(refreshToken: string) {
    try {
      return this.jwtService.verify(refreshToken, {
        publicKey: this.publicKey,
      })
    } catch (e) {
      this.logger.debug(e)
      if (e.name == 'TokenExpiredError') {
        throw new BusinessException(TokenError.EXPIRED, HttpStatus.UNAUTHORIZED)
      } else {
        throw new BusinessException(TokenError.INVALID, HttpStatus.UNAUTHORIZED)
      }
    }
  }
}
