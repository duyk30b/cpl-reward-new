import { HttpService } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { AresService } from './ares.service'

describe('ArtemisService', () => {
  let service: AresService

  beforeEach(async () => {
    const HttpServiceMockProvider = {
      provide: HttpService,
      useValue: {},
    }
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [AresService, HttpServiceMockProvider],
    }).compile()

    service = module.get<AresService>(AresService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
