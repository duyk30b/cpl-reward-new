import { Injectable, Logger } from '@nestjs/common'
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js'
import { ConfigService } from '@nestjs/config'
import { RedisService } from '@lib/redis'

@Injectable()
export class AmazonCognitoService {
  private readonly logger = new Logger(AmazonCognitoService.name)

  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  async getAccessToken(): Promise<string> {
    const CACHE_TOKEN_KEY = 'cached-cynopsis-token'
    const username = this.configService.get('cynopsis.amz_cognito_username')
    const password = this.configService.get('cynopsis.amz_cognito_password')
    const poolId = this.configService.get('cynopsis.amz_cognito_pool_id')
    const clientId = this.configService.get('cynopsis.amz_cognito_client_id')

    try {
      const cachedToken = (await this.redisService.get(
        CACHE_TOKEN_KEY,
      )) as string

      if (cachedToken) return cachedToken

      const authenticationData = {
        Username: username,
        Password: password,
      }
      const authenticationDetails =
        new AmazonCognitoIdentity.AuthenticationDetails(authenticationData)
      const poolData = {
        UserPoolId: poolId,
        ClientId: clientId,
      }
      const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData)
      const userData = {
        Username: username,
        Pool: userPool,
      }
      const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)

      const cognitoUserSession: AmazonCognitoIdentity.CognitoUserSession =
        await new Promise((resolve, reject) => {
          cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: (result) => {
              resolve(result)
            },
            onFailure: (err) => {
              this.logger.error(err.message || JSON.stringify(err))
              reject(err)
            },
          })
        })

      const accessToken = cognitoUserSession.getAccessToken()
      const jwtToken = accessToken.getJwtToken().replace(/(\r\n|\n|\r)/gm, '')
      const jwtTokenTtl =
        accessToken.getExpiration() - accessToken.getIssuedAt()

      await this.redisService.set(
        CACHE_TOKEN_KEY,
        jwtToken,
        Math.floor(jwtTokenTtl * 0.8),
      )

      return jwtToken
    } catch (e) {
      this.logger.error('Cannot get Amazon Cognito token for Artemis service')
      this.logger.error(e)
      return null
    }
  }
}
