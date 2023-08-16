import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common'
import { AuthFlowService } from './auth-flow.service'
import { FlowAction } from '@lib/flows/enum/flows.enum'
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'
import { ApiCommon } from '../../api-docs/common-headers'
import { getEnumNames } from '@lib/util'
import { IRequestWithAccessToken } from '../../interfaces/request-with-access-token'
import { AddFlowDataDto } from './dto/add-flow-data.dto'

@ApiHeader(ApiCommon.device)
@ApiTags('flows')
@Controller('flow')
export class AuthFlowController {
  constructor(private readonly authFlowService: AuthFlowService) {}

  @Get('/')
  @ApiOperation({ summary: 'Deprecated' })
  async getOldFlow() {
    return { uuid: 'deprecated' }
  }

  @Get('/data')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get flow' })
  @ApiQuery({ name: 'action', enum: getEnumNames(FlowAction) })
  async getFlow(
    @Query('action') action: string,
    @Req() request: IRequestWithAccessToken,
  ) {
    return await this.authFlowService.getFlow(
      action,
      request.accessTokenInfo.userId,
    )
  }

  @Post('/:flow_uuid/add-data')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Add data to flow' })
  @ApiParam({ name: 'flow_uuid' })
  async addFlowData(
    @Param('flow_uuid') flowUuid: string,
    @Req() request: IRequestWithAccessToken,
    @Body() flowData: AddFlowDataDto,
  ) {
    await this.authFlowService.addFlowData(
      flowUuid,
      request.accessTokenInfo.userId,
      flowData,
    )
    return { success: true }
  }
}
