import { Test, TestingModule } from '@nestjs/testing'
import { ApiImportExcelController } from './api-import-excel.controller'

describe('ApiImportExcelController', () => {
  let controller: ApiImportExcelController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiImportExcelController],
    }).compile()

    controller = module.get<ApiImportExcelController>(ApiImportExcelController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
