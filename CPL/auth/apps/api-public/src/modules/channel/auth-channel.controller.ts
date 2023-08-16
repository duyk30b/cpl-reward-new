import { Controller, Get, HttpStatus, Query } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags, ApiHeader } from '@nestjs/swagger'
import { ApiCommon } from '../../api-docs/common-headers'
import { GetChannelByNameDto } from './auth-channel.dto'
import { AuthChannelService } from './auth-channel.service'

@ApiHeader(ApiCommon.device)
@ApiTags('channel')
@Controller('channel')
export class AuthChannelController {
  constructor(private readonly authChannelService: AuthChannelService) {}

  @Get('get-by-name')
  @ApiOperation({ summary: 'Get channel by name' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get channel by name successfully',
  })
  async getChannelByName(@Query() getChannelByNameDto: GetChannelByNameDto) {
    return await this.authChannelService.findByName(getChannelByNameDto)
  }
}
