import { Test, TestingModule } from '@nestjs/testing'
import { AmazonCognitoService } from './amazon-cognito.service'

describe('AmazonCognitoService', () => {
  let service: AmazonCognitoService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AmazonCognitoService],
    }).compile()

    service = module.get<AmazonCognitoService>(AmazonCognitoService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
