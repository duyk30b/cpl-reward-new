import { BotSettingService } from '@lib/grpc-client/common-setting/bot-setting/bot-setting.service'
import { UserService } from '@lib/grpc-client/user/user.service'
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { plainToInstance } from 'class-transformer'
import { lastValueFrom, map } from 'rxjs'
import { Constants } from '../constants'
import {
  CreateUserUnlimitedRequestDto,
  GetUserUnlimitedQuery,
  GrpcUserUnlimitedPaginationResponse,
  RemoveFromUnlimitedRequestDto,
  RemoveFromUnlimitedResponseDto,
  UpdateUserUnlimitedRequestDto,
  UserUnlimitedDto,
} from '../dtos/user-unlimited.dto'
import { IExchangeUserUnlimited } from '../interfaces/user-unlimited.interface'

@Injectable()
export class ExchangeUserUnlimitedService implements OnModuleInit {
  private logger = new Logger(ExchangeUserUnlimitedService.name)
  private userUnlimitedService: IExchangeUserUnlimited
  constructor(
    @Inject(Constants.GRPC_EX_USER_UNLIMITED_TOKEN)
    private readonly client: ClientGrpc,
    private readonly userService: UserService,
    private readonly bottSettingService: BotSettingService,
  ) {}
  onModuleInit() {
    this.userUnlimitedService = this.client.getService(
      Constants.GRPC_EX_USER_UNLIMITED_SERVICE,
    )
  }

  public async getUserUnlimited(
    queryDto: GetUserUnlimitedQuery,
  ): Promise<GrpcUserUnlimitedPaginationResponse> {
    return await lastValueFrom(
      this.userUnlimitedService.getUserUnlimited(queryDto).pipe(
        map((response) =>
          plainToInstance(GrpcUserUnlimitedPaginationResponse, response, {
            exposeDefaultValues: true,
          }),
        ),
      ),
    )
  }

  public async addUserUnlimited(
    request: CreateUserUnlimitedRequestDto,
  ): Promise<UserUnlimitedDto> {
    const user = await this.userService.findById(request.userId)
    if (!user || !Object.keys(user).length) {
      throw new BadRequestException('User is not exist')
    }
    await this.isCheckBot(request.userId)
    request.email = user.email && user.email.length ? user.email : request.email
    const blacklist = await lastValueFrom(
      this.userUnlimitedService.addUserUnlimited(request).pipe(
        map((response) =>
          plainToInstance(UserUnlimitedDto, response, {
            exposeDefaultValues: true,
          }),
        ),
      ),
    )
    return blacklist
  }

  public async updateUserUnlimited(
    request: UpdateUserUnlimitedRequestDto,
  ): Promise<UserUnlimitedDto> {
    await this.isCheckBot(request.userId)
    return lastValueFrom(
      this.userUnlimitedService.updateUserUnlimited(request).pipe(
        map((response) =>
          plainToInstance(UserUnlimitedDto, response, {
            exposeDefaultValues: true,
          }),
        ),
      ),
    )
  }

  public async removeUserUnlimited(
    request: RemoveFromUnlimitedRequestDto,
  ): Promise<RemoveFromUnlimitedResponseDto> {
    return lastValueFrom(
      this.userUnlimitedService.removeUserUnlimited(request).pipe(
        map((response) =>
          plainToInstance(RemoveFromUnlimitedResponseDto, response, {
            exposeDefaultValues: true,
          }),
        ),
      ),
    )
  }

  private async isCheckBot(userId: string): Promise<void> {
    const botSetting = await this.bottSettingService.checkBotById(userId)
    if (botSetting.isBot) {
      throw new BadRequestException('Can not add bot to user unlimited')
    }
  }
}
