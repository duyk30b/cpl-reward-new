import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
import { IBOUnlimitedUserService } from './bo-unlimited-user.interface'

@Injectable()
export class BOUnlimitedUserService implements OnModuleInit {
  private grpcBoUnlimitedUserService: IBOUnlimitedUserService

  constructor(@Inject('BO_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.grpcBoUnlimitedUserService =
      this.client.getService<IBOUnlimitedUserService>('BOUnlimitedUserService')
  }

  async checkUserUnlimited(userId: string): Promise<boolean> {
    const response = this.grpcBoUnlimitedUserService.findOne({ userId })
    const data = await lastValueFrom(response)
    if (data.success && data.data && data.data.userId) {
      return true
    }
    return false
  }
}
