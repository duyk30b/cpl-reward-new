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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Permission } from '../permissions/permission.data'
import { CheckPermission } from '../permissions/permission.decorator'
import {
  ApiCreateOneTagDto,
  ApiCreateTagDto,
  ApiDeleteManyTagDto,
  ApiDeleteOneTagDto,
  ApiFindTagsByIdsDto,
  ApiSearchTagDto,
  ApiUpdateTagDto,
} from './api-tag.dto'
import { ApiTagService } from './api-tag.service'

@ApiTags('tag')
@Controller('tag')
export class ApiTagController {
  constructor(private readonly apiTagService: ApiTagService) {}

  @Post()
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.TAG_CREATE)
  async create(@Body() apiCreateTagDto: ApiCreateTagDto) {
    return await this.apiTagService.create(apiCreateTagDto)
  }

  @Post('/create-one')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.TAG_CREATE)
  async createOne(@Body() apiCreateTagDto: ApiCreateOneTagDto) {
    return await this.apiTagService.createOne(apiCreateTagDto)
  }

  @Get('/search')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.TAG_GET_LIST)
  async search(@Query() apiSearchDto: ApiSearchTagDto) {
    return await this.apiTagService.search(apiSearchDto)
  }

  @Get('/find-by-ids')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.TAG_READ)
  async findByIds(@Query() apiFindTagsByIdsDto: ApiFindTagsByIdsDto) {
    return await this.apiTagService.findByIds(apiFindTagsByIdsDto)
  }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.TAG_UPDATE)
  async update(
    @Param('id') id: number,
    @Body() apiUpdateTagDto: ApiUpdateTagDto,
  ) {
    return await this.apiTagService.update(+id, apiUpdateTagDto)
  }

  @Post('/delete-many')
  @CheckPermission(Permission.TAG_DELETE)
  @ApiBearerAuth('access-token')
  async deleteMany(@Query() apiDeleteManyDto: ApiDeleteManyTagDto) {
    return await this.apiTagService.deleteMany(apiDeleteManyDto)
  }

  @Delete('/:id')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.TAG_DELETE)
  async deleteOne(@Param() apiDeleteOneTagDto: ApiDeleteOneTagDto) {
    return await this.apiTagService.deleteOne(apiDeleteOneTagDto)
  }
}
