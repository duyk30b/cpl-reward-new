import { BotSettingService } from '@lib/grpc-client/common-setting/bot-setting/bot-setting.service'
import { UserService } from '@lib/grpc-client/user'
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
import { CancelOrderByUserIdRequestDto } from '../dtos/cancel-order.dto'
import {
  CreateUserBlackListRequestDto,
  GetUserBlackListQuery,
  GrpcUserBlackListPaginationResponse,
  RemoveFromBlackListRequestDto,
  RemoveFromBlackListResponseDto,
  UpdateUserBlackListRequestDto,
  UserBlackListDto,
} from '../dtos/user-black-list.dto'
import { IExchangeUserBlackList } from '../interfaces/user-black-list.interface'
import { ExchangeOrderService } from './exchange-order.service'

@Injectable()
export class ExchangeUserBlackListService implements OnModuleInit {
  private readonly logger = new Logger(ExchangeUserBlackListService.name)
  private blackListService: IExchangeUserBlackList
  constructor(
    @Inject(Constants.GRPC_EX_BLACK_LIST_TOKEN)
    private readonly client: ClientGrpc,
    private readonly userService: UserService,
    private readonly exchangeOrderService: ExchangeOrderService,
    private readonly bottSettingService: BotSettingService,
  ) {}
  onModuleInit() {
    this.blackListService = this.client.getService(
      Constants.GRPC_EX_BLACK_LIST_SERVICE,
    )
  }

  public async getUserBlackList(
    queryDto: GetUserBlackListQuery,
  ): Promise<GrpcUserBlackListPaginationResponse> {
    return await lastValueFrom(
      this.blackListService.getBlackList(queryDto).pipe(
        map((response) =>
          plainToInstance(GrpcUserBlackListPaginationResponse, response, {
            exposeDefaultValues: true,
          }),
        ),
      ),
    )
  }

  public async addUserBlackList(
    request: CreateUserBlackListRequestDto,
    uid: string,
  ): Promise<UserBlackListDto> {
    const user = await this.userService.findById(request.userId)
    if (!user || !Object.keys(user).length) {
      throw new BadRequestException('User is not exist')
    }
    await this.isCheckBot(request.userId)
    request.email = user.email && user.email.length ? user.email : request.email
    const blacklist = await lastValueFrom(
      this.blackListService.addBlackList(request).pipe(
        map((response) =>
          plainToInstance(UserBlackListDto, response, {
            exposeDefaultValues: true,
          }),
        ),
      ),
    )
    await this.exchangeOrderService.cancelOrderByUserId(
      plainToInstance(CancelOrderByUserIdRequestDto, {
        user_id: request.userId,
        canceller_id: uid,
      }),
    )
    return blacklist
  }

  public async updateUserBlackList(
    request: UpdateUserBlackListRequestDto,
  ): Promise<UserBlackListDto> {
    await this.isCheckBot(request.userId)
    return lastValueFrom(
      this.blackListService.updateBlackList(request).pipe(
        map((response) =>
          plainToInstance(UserBlackListDto, response, {
            exposeDefaultValues: true,
          }),
        ),
      ),
    )
  }

  public async removeUserBlackList(
    request: RemoveFromBlackListRequestDto,
  ): Promise<RemoveFromBlackListResponseDto> {
    return lastValueFrom(
      this.blackListService.removeBlackList(request).pipe(
        map((response) =>
          plainToInstance(RemoveFromBlackListResponseDto, response, {
            exposeDefaultValues: true,
          }),
        ),
      ),
    )
  }

  private async isCheckBot(userId: string): Promise<void> {
    const botSetting = await this.bottSettingService.checkBotById(userId)
    if (botSetting.isBot) {
      throw new BadRequestException('Can not add bot to black list')
    }
  }
}
