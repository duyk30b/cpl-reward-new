import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { ApiReasonService } from './api-reason.service'
import { CheckPermission } from '../../permissions/permission.decorator'
import { Permission } from '../../permissions/permission.data'
import { CreateReasonDto, ReasonDto, ReasonFilterDto } from './api-reason.dto'
import { IBaseReasonResponse } from '@lib/grpc-client/reason/interfaces/reason.interface'

@ApiTags('reason')
@Controller('reason')
@UseInterceptors(ClassSerializerInterceptor)
export class ApiReasonController {
  constructor(private readonly apiReasonService: ApiReasonService) {}

  @Post()
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_REASON_CREATE)
  async create(@Body() createReason: CreateReasonDto) {
    return await this.apiReasonService.create(createReason)
  }

  @Get()
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_REASON_GET_LIST)
  async findAll(@Query() reasonFilter: ReasonFilterDto) {
    return this.apiReasonService.findAll(reasonFilter)
  }

  @Get('/:id')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_REASON_GET_LIST)
  async findById(@Param('id') id: string) {
    return await this.apiReasonService.findById(id)
  }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_REASON_UPDATE)
  async update(
    @Param('id') id: number,
    @Body() reason: ReasonDto,
  ): Promise<IBaseReasonResponse> {
    return await this.apiReasonService.update(reason)
  }

  @Delete('/:id')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_REASON_DELETE)
  async deleteOne(@Param('id') id: string): Promise<IBaseReasonResponse> {
    return await this.apiReasonService.delete(id)
  }
}
