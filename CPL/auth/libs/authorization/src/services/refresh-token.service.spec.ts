import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import jwt from 'config/jwt'
import { RefreshTokenService } from './refresh-token.service'

describe('RefreshTokenService', () => {
  let service: RefreshTokenService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({}), ConfigModule.forRoot({ load: [jwt] })],
      providers: [RefreshTokenService],
    }).compile()

    service = module.get<RefreshTokenService>(RefreshTokenService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
