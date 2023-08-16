import { ISumsubWebhookPayload } from '@lib/sumsub'
import { Body, Controller, Get, Post, Req } from '@nestjs/common'
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger'
import { ApiCommon } from '../../api-docs/common-headers'
import { IRequestWithAccessToken } from '../../interfaces/request-with-access-token'
import { ApiSumsubService } from './api-sumsub.service'

@ApiTags('sumsub')
@Controller('sumsub')
export class ApiSumsubController {
  constructor(private readonly apiSumsubService: ApiSumsubService) {}

  @Get('token')
  @ApiHeader(ApiCommon.device)
  @ApiBearerAuth('access-token')
  async getToken(@Req() request: IRequestWithAccessToken) {
    return await this.apiSumsubService.createToken(
      request.accessTokenInfo.userId,
    )
  }

  @Post('/hook')
  async handleSumsubHook(@Body() data: ISumsubWebhookPayload) {
    await this.apiSumsubService.handleSumsubHook(data)
    return { success: true }
  }
}
