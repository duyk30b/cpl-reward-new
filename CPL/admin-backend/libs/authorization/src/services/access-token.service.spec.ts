import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import jwt from 'config/jwt'
import { AccessTokenService } from './access-token.service'

describe('AccessTokenService', () => {
  let service: AccessTokenService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({}), ConfigModule.forRoot({ load: [jwt] })],
      providers: [AccessTokenService],
    }).compile()

    service = module.get<AccessTokenService>(AccessTokenService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
