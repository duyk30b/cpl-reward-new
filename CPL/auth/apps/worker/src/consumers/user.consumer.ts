import { Processor, Process } from '@nestjs/bull'
import { Job } from 'bull'
import { UserJob, USER_QUEUE } from '@lib/redis-queue/redis-queue.variable'
import { WorkerUserService } from '../services/worker-user.service'
import {
  IUserAuthenticatorStatusUpdatedEvent,
  IUserBanEvent,
  IUserChangeEmailEvent,
  IUserChangeInfoEvent,
  IUserChangeLvEvent,
  IUserChangePasswordEvent,
  IUserCreatedEvent,
  IUserDeleteAccountEvent,
  IUserLoginEvent,
  IUserLogoutEvent,
  IUserProactivelyLogoutEvent,
  IUserUnbanEvent,
  IUserUpdatedEvent,
} from '@lib/redis-queue'

@Processor(USER_QUEUE)
export class UserConsumer {
  constructor(private readonly workerUserService: WorkerUserService) {}

  @Process(UserJob.USER_DELETE_ACCOUNT)
  handleUserDeleteAccount(job: Job<IUserDeleteAccountEvent>) {
    this.workerUserService.handleUserDeleteAccount(job.data)
  }

  @Process(UserJob.USER_BAN)
  handleUserBan(job: Job<IUserBanEvent>) {
    this.workerUserService.handleUserBan(job.data)
  }

  @Process(UserJob.USER_UNBAN)
  handleUserUnban(job: Job<IUserUnbanEvent>) {
    this.workerUserService.handleUserUnban(job.data)
  }

  @Process(UserJob.USER_CREATED)
  handleUserCreated(job: Job<IUserCreatedEvent>) {
    this.workerUserService.handleUserCreated(job.data)
  }

  @Process(UserJob.AUTHENTICATOR_STATUS_UPDATED)
  handleAuthenticatorStatusUpdated(
    job: Job<IUserAuthenticatorStatusUpdatedEvent>,
  ) {
    this.workerUserService.handleAuthenticatorStatusUpdated(job.data)
  }

  @Process(UserJob.USER_LOGIN)
  handleUserLogin(job: Job<IUserLoginEvent>) {
    this.workerUserService.handleUserLogin(job.data)
  }

  @Process(UserJob.USER_LOGOUT)
  handleUserLogout(job: Job<IUserLogoutEvent>) {
    this.workerUserService.handleUserLogout(job.data)
  }

  @Process(UserJob.USER_CHANGE_EMAIL)
  handleUserChangeEmail(job: Job<IUserChangeEmailEvent>) {
    this.workerUserService.handleUserChangeEmail(job.data)
  }

  @Process(UserJob.USER_CHANGE_LV)
  handleUserChangeLv(job: Job<IUserChangeLvEvent>) {
    this.workerUserService.handleUserChangeLv(job.data)
  }

  @Process(UserJob.USER_CHANGE_INFO)
  handleUserChangeInfo(job: Job<IUserChangeInfoEvent>) {
    this.workerUserService.handleUserChangeInfo(job.data)
  }

  @Process(UserJob.USER_CHANGE_PASSWORD)
  handleUserChangePassword(job: Job<IUserChangePasswordEvent>) {
    this.workerUserService.handleUserChangePassword(job.data)
  }

  @Process(UserJob.USER_PROACTIVELY_LOGOUT)
  handleUserProactivelyLogout(job: Job<IUserProactivelyLogoutEvent>) {
    this.workerUserService.handleUserProactivelyLogout(job.data)
  }

  @Process(UserJob.USER_UPDATED)
  handleUserUpdated(job: Job<IUserUpdatedEvent>) {
    this.workerUserService.handleUserUpdated(job.data)
  }
}
