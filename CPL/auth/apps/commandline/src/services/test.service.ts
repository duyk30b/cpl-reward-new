import { SumsubService } from '@lib/sumsub'
import { UploadFileService } from '@lib/upload-file'
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Command } from 'nest-commander'
import { RedisQueueService } from '@lib/redis-queue'
import { UserService } from '@lib/user'

@Command({ name: 'test' })
export class TestService {
  private readonly logger = new Logger(TestService.name)
  private readonly kycFaceCollection: string
  constructor(
    private readonly sumsubService: SumsubService,
    private readonly configService: ConfigService,
    private readonly uploadFileService: UploadFileService,
    private readonly redisQueueService: RedisQueueService,
    private readonly userService: UserService,
  ) {}

  async run(passedParam: string[]): Promise<void> {
    const applicant = await this.sumsubService.getApplicantData('51878')
    console.dir(applicant, { depth: null, colors: true })
    let res = await this.sumsubService.getUserInspection(applicant.inspectionId)
    console.dir(res, { depth: null, colors: true })
    // const status = await this.sumsubService.getApplicantStatus(applicant.id)
    // console.dir(status, { depth: null, colors: true })
    // process.exit()
  }
}
