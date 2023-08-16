import { Test, TestingModule } from '@nestjs/testing'
import { createMockRepositoryProvider } from 'apps/test/helpers/mock.helper'
import { UploadedFile } from '../entities/uploaded-file.entity'
import { FileService } from './file.service'

describe('FileService', () => {
  let service: FileService

  beforeEach(async () => {
    const FileRepositoryProvider = createMockRepositoryProvider(UploadedFile)
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileService, FileRepositoryProvider],
    }).compile()

    service = module.get<FileService>(FileService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
