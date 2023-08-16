import { Test, TestingModule } from '@nestjs/testing'
import { MultipartUploaderService } from './multipart-uploader.service'

describe('MultipartUploaderService', () => {
  let service: MultipartUploaderService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MultipartUploaderService],
    }).compile()

    service = module.get<MultipartUploaderService>(MultipartUploaderService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
