import { Processor, Process } from '@nestjs/bull'
import { Job } from 'bull'
import { WorkerKycService } from '../services/worker-kyc.service'
import { KycJob, KYC_QUEUE } from '@lib/redis-queue/redis-queue.variable'
import {
  IAutoKycFinishedEvent,
  IKycDocumentApprovedEvent,
  IUserKycRegisteredEvent,
  IUserKycStatusUpdatedEvent,
} from '@lib/redis-queue'

@Processor(KYC_QUEUE)
export class KycConsumer {
  constructor(private readonly workerKycService: WorkerKycService) {}

  @Process(KycJob.KYC_REGISTERED)
  handleKycRegistered(job: Job<IUserKycRegisteredEvent>) {
    this.workerKycService.handleKycRegistered(job.data)
  }

  @Process(KycJob.KYC_DOCUMENT_APPROVED)
  handleDocumentApproved(job: Job<IKycDocumentApprovedEvent>) {
    this.workerKycService.handleDocumentApproved(job.data)
  }

  @Process(KycJob.KYC_STATUS_UPDATED)
  handleKycStatusUpdated(job: Job<IUserKycStatusUpdatedEvent>) {
    this.workerKycService.handleKycStatusUpdated(job.data)
  }

  @Process(KycJob.AUTO_KYC_FINISHED)
  handleAutoKycFinished(job: Job<IAutoKycFinishedEvent>) {
    this.workerKycService.handleAutoKycFinished(job.data)
  }
}
