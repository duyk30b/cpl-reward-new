import { S3Client } from '@aws-sdk/client-s3'
import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { UploadFileService } from './upload-file.service'

describe('UploadFileService', () => {
  let service: UploadFileService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [UploadFileService, S3Client],
    }).compile()

    service = module.get<UploadFileService>(UploadFileService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
