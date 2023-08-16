import { Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import {
  PROCESSOR_API_LANGUAGE_QUEUE,
  QUEUE_IMPORT_TRANSLATES,
} from '@lib/queue'
import { TranslateApplyAllEvent } from './api-language.event'
import { plainToInstance } from 'class-transformer'
import { ApiLanguageService } from './api-language.service'

@Processor(PROCESSOR_API_LANGUAGE_QUEUE)
export class ApiLanguageProcessor {
  private readonly logger = new Logger(ApiLanguageProcessor.name)

  constructor(private apiLanguageService: ApiLanguageService) {}

  @Process(QUEUE_IMPORT_TRANSLATES)
  async handleBanUser(job: Job) {
    const { excelKey, upsertData } = plainToInstance(
      TranslateApplyAllEvent,
      job.data,
    )
    await this.apiLanguageService.setTranslates(upsertData)
    this.logger.log(
      `[MULTI LANG] setTranslates key: ${excelKey}, length: ${upsertData.length}`,
    )
  }
}
