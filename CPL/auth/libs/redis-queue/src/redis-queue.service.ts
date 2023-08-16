import { Injectable, OnModuleInit } from '@nestjs/common'
import { getQueueToken, InjectQueue } from '@nestjs/bull'
import { Queue, JobStatus } from 'bull'
import {
  EXPORT_USER_QUEUE,
  EXPORT_USER_TAG_QUEUE,
  KycJob,
  KYC_QUEUE,
  SumsubJob,
  SUMSUB_QUEUE,
  UserJob,
  USER_QUEUE,
} from './redis-queue.variable'
import {
  IUserCreatedEvent,
  IUserDeleteAccountEvent,
  IUserBanEvent,
  IUserUnbanEvent,
  IUserAuthenticatorStatusUpdatedEvent,
  IUserLoginEvent,
  IUserLogoutEvent,
  IUserChangeEmailEvent,
  IUserChangeLvEvent,
  IUserChangeInfoEvent,
  IUserChangePasswordEvent,
  IUserProactivelyLogoutEvent,
  IUserKycStatusUpdatedEvent,
  IAutoKycFinishedEvent,
  IUserUpdatedEvent,
  IKycDocumentApprovedEvent,
  IUserRequestDeleteAccountEvent,
  ISumsubApplicantPendingEvent,
} from './redis-queue.type'
import EventEmitter = require('events')
import { QUEUES } from './redis-queue.module'
import { ModuleRef } from '@nestjs/core'

@Injectable()
export class RedisQueueService implements OnModuleInit {
  constructor(
    private readonly moduleRef: ModuleRef,
    @InjectQueue(KYC_QUEUE) private kycQueue: Queue,
    @InjectQueue(SUMSUB_QUEUE) private sumsubQueue: Queue,
    @InjectQueue(EXPORT_USER_QUEUE) private exportUserQueue: Queue,
    @InjectQueue(EXPORT_USER_TAG_QUEUE) private exportUserTagQueue: Queue,
    @InjectQueue(USER_QUEUE) private userQueue: Queue,
  ) {}

  private readonly QUEUE_STATES: JobStatus[] = [
    'waiting',
    'active',
    'completed',
    'failed',
    'delayed',
    'paused',
  ]

  onModuleInit() {
    EventEmitter.defaultMaxListeners = 20
  }

  addUserCreatedJob(data: IUserCreatedEvent) {
    this.userQueue.add(UserJob.USER_CREATED, data)
  }

  addUserRequestDeleteAccountJob(data: IUserRequestDeleteAccountEvent) {
    this.userQueue.add(UserJob.USER_REQUEST_DELETE_ACCOUNT, data)
  }

  addUserDeleteAccountJob(data: IUserDeleteAccountEvent) {
    this.userQueue.add(UserJob.USER_DELETE_ACCOUNT, data)
  }

  addUserBanJob(data: IUserBanEvent) {
    this.userQueue.add(UserJob.USER_BAN, data)
  }

  addUserUnbanJob(data: IUserUnbanEvent) {
    this.userQueue.add(UserJob.USER_UNBAN, data)
  }

  addAuthenticatorStatusUpdatedJob(data: IUserAuthenticatorStatusUpdatedEvent) {
    this.userQueue.add(UserJob.AUTHENTICATOR_STATUS_UPDATED, data)
  }

  addUserLoginJob(data: IUserLoginEvent) {
    this.userQueue.add(UserJob.USER_LOGIN, data)
  }

  addUserLogoutJob(data: IUserLogoutEvent) {
    this.userQueue.add(UserJob.USER_LOGOUT, data)
  }

  addUserChangeEmailJob(data: IUserChangeEmailEvent) {
    this.userQueue.add(UserJob.USER_CHANGE_EMAIL, data)
  }

  addUserChangeLvJob(data: IUserChangeLvEvent) {
    this.userQueue.add(UserJob.USER_CHANGE_LV, data)
  }

  addUserChangeInfoJob(data: IUserChangeInfoEvent) {
    this.userQueue.add(UserJob.USER_CHANGE_INFO, data)
  }

  addUserChangePasswordJob(data: IUserChangePasswordEvent) {
    this.userQueue.add(UserJob.USER_CHANGE_PASSWORD, data)
  }

  addUserProactivelyLogoutJob(data: IUserProactivelyLogoutEvent) {
    this.userQueue.add(UserJob.USER_PROACTIVELY_LOGOUT, data)
  }

  addUserUpdatedJob(data: IUserUpdatedEvent) {
    this.userQueue.add(UserJob.USER_UPDATED, data)
  }

  addKycRegisteredJob(userId: string) {
    // Delay 10s để tránh mail lv4 đến trc mail lv3
    this.kycQueue.add(KycJob.KYC_REGISTERED, { userId }, { delay: 10000 })
  }

  async addKycStatusUpdatedJob(data: IUserKycStatusUpdatedEvent) {
    return await this.kycQueue.add(KycJob.KYC_STATUS_UPDATED, data)
  }

  async addSumsubApplicantPendingJob(data: ISumsubApplicantPendingEvent) {
    return await this.sumsubQueue.add(SumsubJob.SUMSUB_APPLICANT_PENDING, data)
  }

  async addSumsubApplicantReviewedJob(userId: string) {
    return await this.sumsubQueue.add(
      SumsubJob.SUMSUB_APPLICANT_REVIEWED,
      { userId },
      {
        attempts: 3,
        backoff: 60000,
      },
    )
  }

  addAutoKycFinishedJob(data: IAutoKycFinishedEvent) {
    this.kycQueue.add(KycJob.AUTO_KYC_FINISHED, data)
  }

  addKycDocumentApprovedJob(data: IKycDocumentApprovedEvent) {
    this.kycQueue.add(KycJob.KYC_DOCUMENT_APPROVED, data)
  }

  async addExportUserJob(data: any) {
    const inqueueCount = await this.exportUserQueue.count()

    if (inqueueCount === 0) {
      this.exportUserQueue.add(data)
      return true
    }

    return false
  }

  async addExportUserTagJob(data: any) {
    const inqueueCount = await this.exportUserTagQueue.count()

    if (inqueueCount === 0) {
      this.exportUserTagQueue.add(data)
      return true
    }

    return false
  }

  async getLastExportUserJob(queueName: string) {
    const queueNameToInstanceMapper = {
      [EXPORT_USER_QUEUE]: this.exportUserQueue,
      [EXPORT_USER_TAG_QUEUE]: this.exportUserTagQueue,
    }

    if (!queueNameToInstanceMapper[queueName]) {
      return null
    }

    const jobs = await queueNameToInstanceMapper[queueName].getJobs(
      this.QUEUE_STATES,
      0,
      0,
    )

    jobs.sort((a, b) => Number(b.id) - Number(a.id))

    return jobs.shift()
  }

  async getStatus() {
    const queues = QUEUES.map(({ name }) =>
      this.moduleRef.get<Queue>(getQueueToken(name), { strict: false }),
    )
    const result = {}
    for (const queue of queues) {
      result[queue.name] = await queue.getJobCounts()
    }
    return result
  }
}
