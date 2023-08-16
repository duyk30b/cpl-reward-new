import { BusinessException, FirebaseError } from '@lib/util'
import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import jwtDecode, { JwtPayload } from 'jwt-decode'
import { map } from 'rxjs'
import { IValidateIdToken } from './firebase.variable'

@Injectable()
export class FirebaseService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async validateIdToken(validateIdTokenDto: IValidateIdToken) {
    const identityUrl =
      'https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=' +
      this.configService.get('firebase.api_key')

    let firebaseUser = null
    try {
      const jwtData = jwtDecode<JwtPayload>(validateIdTokenDto.id_token)

      // Validate form of id_token (jwt)
      if (
        !jwtData ||
        !jwtData.exp ||
        jwtData.exp < new Date().getTime() / 1000
      ) {
        throw new BusinessException(FirebaseError.INVALID_ID_TOKEN)
      }

      // Call Google identify API to validate the id_token
      const data = await this.httpService
        .post(identityUrl, {
          id_token: validateIdTokenDto.id_token,
        })
        .pipe(map((response) => response.data))
        .toPromise()

      firebaseUser = data.users[0]
    } catch (e) {
      throw new BusinessException(FirebaseError.INVALID_ID_TOKEN)
    }

    if (!firebaseUser) {
      throw new BusinessException(FirebaseError.INVALID_ID_TOKEN)
    }

    return {
      ...firebaseUser,
      firebaseId:
        firebaseUser.providerUserInfo[0].email ??
        firebaseUser.providerUserInfo[0].rawId,
    }
  }
}
