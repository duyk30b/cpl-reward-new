import { Test, TestingModule } from '@nestjs/testing'
import { TokenController } from './token.controller'
import { TokenService } from './token.service'
import { ConfigModule } from '@nestjs/config'
import jwt from 'config/jwt'

describe('TokenController', () => {
  let controller: TokenController

  beforeEach(async () => {
    const TokenServiceMockProvider = {
      provide: TokenService,
      useValue: {},
    }
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [jwt] })],
      controllers: [TokenController],
      providers: [TokenServiceMockProvider],
    }).compile()

    controller = module.get<TokenController>(TokenController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
