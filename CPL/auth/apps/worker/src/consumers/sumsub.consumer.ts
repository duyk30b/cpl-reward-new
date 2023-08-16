import { Processor, Process } from '@nestjs/bull'
import { Job } from 'bull'
import { WorkerSumsubService } from '../services/worker-sumsub.service'
import { SumsubJob, SUMSUB_QUEUE } from '@lib/redis-queue/redis-queue.variable'
import {
  ISumsubApplicantPendingEvent,
  ISumsubApplicantReviewedEvent,
} from '@lib/redis-queue'

@Processor(SUMSUB_QUEUE)
export class SumsubConsumer {
  constructor(private readonly workerSumsubService: WorkerSumsubService) {}

  @Process(SumsubJob.SUMSUB_APPLICANT_PENDING)
  handleSumsubApplicantPending(job: Job<ISumsubApplicantPendingEvent>) {
    this.workerSumsubService.handleSumsubApplicantPending(job.data)
  }

  @Process(SumsubJob.SUMSUB_APPLICANT_REVIEWED)
  handleSumsubApplicantReviewed(job: Job<ISumsubApplicantReviewedEvent>) {
    this.workerSumsubService.handleSumsubApplicantReviewed(job.data)
  }
}
