import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger'
import { Permission } from '../permissions/permission.data'
import { CheckPermission } from '../permissions/permission.decorator'
import {
  ApiCreateChannelDto,
  ApiUpdateChannelDto,
  DeleteChannelDto,
  FindOneByIdDto,
  FindOneByLinkDto,
  ListChannelDto,
} from './api-channel.dto'
import { ApiChannelService } from './api-channel.service'

@ApiTags('channel')
@Controller('channel')
export class ApiChannelController {
  constructor(private readonly apiChannelService: ApiChannelService) {}

  @Post()
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.CHANNEL_CREATE)
  async create(@Body() apiCreateChannelDto: ApiCreateChannelDto) {
    return await this.apiChannelService.create(apiCreateChannelDto)
  }

  @Get()
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.CHANNEL_GET_LIST)
  async findAll(@Query() listChannelDto: ListChannelDto) {
    return await this.apiChannelService.findAll(listChannelDto)
  }

  @Get('/link')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.CHANNEL_READ)
  @ApiQuery({ name: 'link', required: true })
  async findOneByLink(@Query() findOneByLinkDto: FindOneByLinkDto) {
    return await this.apiChannelService.findOneByLink(findOneByLinkDto)
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.CHANNEL_READ)
  async findOneById(@Param() findOneByIdDto: FindOneByIdDto) {
    return await this.apiChannelService.findOneById(findOneByIdDto)
  }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.CHANNEL_UPDATE)
  async update(
    @Param('id') id: string,
    @Body() apiUpdateChannelDto: ApiUpdateChannelDto,
  ) {
    return await this.apiChannelService.update(+id, apiUpdateChannelDto)
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.CHANNEL_DELETE)
  async delete(@Param() deleteDto: DeleteChannelDto) {
    return await this.apiChannelService.delete(deleteDto)
  }
}
