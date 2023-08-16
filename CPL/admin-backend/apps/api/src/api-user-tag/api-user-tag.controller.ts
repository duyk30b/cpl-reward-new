import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Permission } from '../permissions/permission.data'
import { CheckPermission } from '../permissions/permission.decorator'
import {
  ApiAddUserTagsDto,
  ApiDeleteUserTagDto,
  ApiDeleteUserTagsByUsersDto,
  ApiDeleteUserTagsDto,
  ApiFindByIdDto,
  ApiFindUserTagsByUserIdDto,
  ApiListUserTagDto,
} from './api-user-tag.dto'
import { ApiUserTagService } from './api-user-tag.service'

@ApiTags('user-tag')
@Controller('user-tag')
export class ApiUserTagController {
  constructor(private readonly apiUserTagService: ApiUserTagService) {}

  @Post()
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_TAG_CREATE)
  async create(@Body() apiAddUserTagsDto: ApiAddUserTagsDto) {
    return await this.apiUserTagService.create(apiAddUserTagsDto)
  }

  @Get()
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_TAG_READ)
  async list(@Query() apiListUserTagDto: ApiListUserTagDto) {
    return await this.apiUserTagService.listUserTags(apiListUserTagDto)
  }

  @Get('/by-user-id')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.TAG_READ)
  async findByUserId(
    @Query() apiFindUserTagsByUserIdDto: ApiFindUserTagsByUserIdDto,
  ) {
    return await this.apiUserTagService.findByUserId(apiFindUserTagsByUserIdDto)
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_TAG_READ)
  async findById(@Param() apiFindByIdDto: ApiFindByIdDto) {
    return await this.apiUserTagService.findById(apiFindByIdDto)
  }

  @Post('/delete-many')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_TAG_DELETE)
  async deleteMany(@Query() apiDeleteUserTagsDto: ApiDeleteUserTagsDto) {
    return await this.apiUserTagService.deleteMany(apiDeleteUserTagsDto)
  }

  @Post('/delete-many-by-users')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_TAG_DELETE)
  async deleteManyByUsers(
    @Body() apiDeleteUserTagsByUsersDto: ApiDeleteUserTagsByUsersDto,
  ) {
    return await this.apiUserTagService.deleteManyByUsers(
      apiDeleteUserTagsByUsersDto,
    )
  }

  @Delete('/:id')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_TAG_DELETE)
  async deleteOne(@Param() apiDeleteUserTagDto: ApiDeleteUserTagDto) {
    return await this.apiUserTagService.deleteOne(apiDeleteUserTagDto)
  }
}
