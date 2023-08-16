import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { plainToInstance } from 'class-transformer'
import { lastValueFrom } from 'rxjs'
import { UserDto } from './user.dto'
import { IUserFilter, IUserList, IUserService } from './user.interface'

@Injectable()
export class UserService {
  private userService: IUserService
  constructor(@Inject('USER_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.userService = this.client.getService<IUserService>('UserService')
  }

  async findById(userId: string): Promise<UserDto> {
    const req = this.userService.findOne({ id: userId })
    const user = await lastValueFrom(req)
    return plainToInstance(UserDto, user, {
      enableImplicitConversion: true,
      ignoreDecorators: true,
    })
  }

  async searchByFilter(filter: IUserFilter): Promise<IUserList> {
    const req = this.userService.searchByFilter(filter)
    const data = await lastValueFrom(req)
    data.data = (data.data || []).map((item) =>
      plainToInstance(UserDto, item, { ignoreDecorators: true }),
    )
    return data
  }
}
