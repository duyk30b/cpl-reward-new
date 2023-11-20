import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
import { AddUserTagInput, IUserTagService } from './user-tag.interface'

@Injectable()
export class UserTagService {
  private readonly logger = new Logger(UserTagService.name)
  private userTagService: IUserTagService

  constructor(@Inject('USER_TAG_PACKAGE') private clientGrpc: ClientGrpc) {}

  onModuleInit() {
    this.userTagService = this.clientGrpc.getService<IUserTagService>('GUserTagService')
  }

  async addUserTags(dataUserTag: AddUserTagInput) {
    return await lastValueFrom(this.userTagService.addUserTags(dataUserTag))
  }
}
