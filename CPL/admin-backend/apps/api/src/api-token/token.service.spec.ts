import { Test, TestingModule } from '@nestjs/testing'
import { AccessTokenService } from '@lib/authorization'
import { AccessTokenServiceMock } from 'apps/test/mock/common/access-token.service.mock'
import { TokenService } from './token.service'

describe('TokenService', () => {
  let service: TokenService
  let accessTokenServiceMock: AccessTokenService

  beforeEach(async () => {
    const AccessTokenServiceMockProvider = {
      provide: AccessTokenService,
      useClass: AccessTokenServiceMock,
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenService, AccessTokenServiceMockProvider],
    }).compile()

    service = module.get<TokenService>(TokenService)
    accessTokenServiceMock = module.get<AccessTokenService>(AccessTokenService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('grantAccessToken', () => {
    it('should return new access token', () => {
      const accessTokenPayload = {
        appId: 1,
        userId: 1,
        deviceId: 1,
        scopes: 'all',
      }
      const newAccessToken = 'test'

      const accessTokenServiceMockSpy = jest
        .spyOn(accessTokenServiceMock, 'create')
        .mockReturnValue(newAccessToken)

      expect(service.grantAccessToken(accessTokenPayload)).toEqual(
        newAccessToken,
      )

      expect(accessTokenServiceMockSpy).toHaveBeenCalledWith(accessTokenPayload)
    })
  })
})
