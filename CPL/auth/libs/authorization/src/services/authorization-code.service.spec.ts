import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import jwt from 'config/jwt'
import { AuthorizationCodeService } from './authorization-code.service'

describe('AuthorizationCodeService', () => {
  let service: AuthorizationCodeService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({}), ConfigModule.forRoot({ load: [jwt] })],
      providers: [AuthorizationCodeService],
    }).compile()

    service = module.get<AuthorizationCodeService>(AuthorizationCodeService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
