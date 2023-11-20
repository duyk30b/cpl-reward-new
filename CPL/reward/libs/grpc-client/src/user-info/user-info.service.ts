import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { plainToInstance } from 'class-transformer'
import { lastValueFrom } from 'rxjs'
import { IUserInfoService } from './user-info.interface'
import { UserInfoDto } from './user-info.dto'

@Injectable()
export class UserInfoService {
  private service: IUserInfoService
  constructor(@Inject('USER_INFO_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.service = this.client.getService<IUserInfoService>('UserInfoService')
  }

  async findByUserId(userId: string): Promise<UserInfoDto> {
    const req = this.service.findByUserId({ userId })
    const result = await lastValueFrom(req)
    return result.data
      ? plainToInstance(UserInfoDto, result.data, {
          ignoreDecorators: true,
        })
      : null
  }
}
