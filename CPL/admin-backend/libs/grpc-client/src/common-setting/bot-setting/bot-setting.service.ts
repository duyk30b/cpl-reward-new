import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { plainToInstance } from 'class-transformer'
import { catchError, lastValueFrom, map } from 'rxjs'
import { CheckBotByIdResponse } from './bot-setting.dto'
import { IBotSettingService } from './bot-setting.interface'
import { CommonSettingConstant } from '../common-setting.constant'

@Injectable()
export class BotSettingService implements OnModuleInit {
  private readonly logger = new Logger(BotSettingService.name)
  private botSettingService: IBotSettingService
  constructor(
    @Inject(CommonSettingConstant.GRPC_COMMON_SETTING_BOT_TOKEN)
    private readonly client: ClientGrpc,
  ) {}
  onModuleInit() {
    this.botSettingService = this.client.getService(
      CommonSettingConstant.GRPC_COMMON_SETTING_BOT_SERVICE,
    )
  }

  public async checkBotById(userId: string): Promise<CheckBotByIdResponse> {
    this.logger.log(`checkBotById: ${userId}`)
    return lastValueFrom(
      this.botSettingService.checkBotById({ userId }).pipe(
        map((response) => plainToInstance(CheckBotByIdResponse, response)),
        catchError((error) => {
          this.logger.error(error)
          throw error
        }),
      ),
    )
  }
}
