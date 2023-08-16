import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { plainToInstance } from 'class-transformer'
import { lastValueFrom } from 'rxjs'
import { UserDto } from './user.dto'
import { IUserService } from './user.interface'

@Injectable()
export class UserService {
  private userService: IUserService
  constructor(@Inject('USER_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.userService = this.client.getService<IUserService>('UserService')
  }

  async findById(userId: string): Promise<UserDto> {
    const req = this.userService.findOne({ id: userId })
    const res = await lastValueFrom(req)
    const user = plainToInstance(UserDto, res, {
      enableImplicitConversion: true,
      ignoreDecorators: true,
    })
    if (!user.id) return null
    return user
  }
}
