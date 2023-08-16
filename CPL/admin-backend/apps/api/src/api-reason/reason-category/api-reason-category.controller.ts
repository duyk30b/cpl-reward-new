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
import { CheckPermission } from '../../permissions/permission.decorator'
import { Permission } from '../../permissions/permission.data'
import { ApiReasonCategoryService } from './api-reason-category.service'
import { IReasonCategory } from '@lib/grpc-client/reason/interfaces/reason-category.interface'
import {
  CreateReasonCategoryDto,
  ReasonCategoryFilterDto,
} from './api-reason-category.dto'

@ApiTags('reason-category')
@Controller('reason-category')
export class ApiReasonCategoryController {
  constructor(
    private readonly apiReasonCategoryService: ApiReasonCategoryService,
  ) {}

  @Get('/language')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_REASON_CATEGORY_GET_LIST)
  async getLanguage() {
    return this.apiReasonCategoryService.getLanguage()
  }

  @Post()
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_REASON_CATEGORY_CREATE)
  async create(@Body() createReasonCategory: CreateReasonCategoryDto) {
    return await this.apiReasonCategoryService.create(createReasonCategory)
  }

  @Get()
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_REASON_CATEGORY_GET_LIST)
  async findAll(@Query() categoryFilter: ReasonCategoryFilterDto) {
    return this.apiReasonCategoryService.findAll(categoryFilter)
  }

  @Get('/:id')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_REASON_GET_LIST)
  async findById(@Param('id') id: string) {
    return await this.apiReasonCategoryService.findById(id)
  }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_REASON_CATEGORY_UPDATE)
  async update(
    @Param('id') id: number,
    @Body() reasonCategory: IReasonCategory,
  ) {
    return await this.apiReasonCategoryService.update(reasonCategory)
  }

  @Delete('/:id')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_REASON_CATEGORY_DELETE)
  async deleteOne(@Param('id') id: string) {
    return await this.apiReasonCategoryService.delete(id)
  }
}
