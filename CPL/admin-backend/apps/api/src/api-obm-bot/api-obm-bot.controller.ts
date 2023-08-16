import { ApiObmBotService } from './api-obm-bot.service'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { CheckPermission } from '../permissions/permission.decorator'
import { Permission } from '../permissions/permission.data'
import {
  BotSettingItem,
  BotSettingPagination,
  BotSettingParams,
} from '@lib/grpc-client/obm-bot-id'

@Controller('obm-bot')
@ApiTags('obm-bot')
export class ApiObmBotController {
  constructor(private readonly apiObmBotService: ApiObmBotService) {}

  @ApiOperation({ summary: 'Get bot setting' })
  @Get()
  @HttpCode(HttpStatus.OK)
  @CheckPermission(Permission.OBM_BOT_READ)
  async getBotSetting(
    @Query() query: BotSettingParams,
  ): Promise<BotSettingPagination> {
    return await this.apiObmBotService.getBotSetting(query)
  }

  @ApiOperation({ summary: 'update bot setting' })
  @Put()
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: BotSettingItem })
  @CheckPermission(Permission.OBM_BOT_UPDATE)
  async updateBot(
    @Body()
    botSetting: BotSettingItem,
  ) {
    return await this.apiObmBotService.updateBotSetting(botSetting)
  }

  @ApiOperation({ summary: 'create bot setting' })
  @Post('/create')
  @HttpCode(HttpStatus.OK)
  @CheckPermission(Permission.OBM_BOT_UPDATE)
  async createBot(
    @Body()
    body: {
      email: string
    },
  ) {
    return await this.apiObmBotService.createBotUser(body)
  }
}
