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
import { Permission } from '../../permissions/permission.data'
import { CheckPermission } from '../../permissions/permission.decorator'
import {
  ApiCreateNewsDTO,
  ApiUpdateNewsDTO,
  DeleteNewsDTO,
  FindOneByIdDTO,
  ListNewsDTO,
} from './news.dto'
import { NewsService } from './news.service'

@ApiTags('BO New')
@Controller('bo/news')
export class NewsController {
  constructor(private readonly apiNewsService: NewsService) {}

  @Post('/')
  @CheckPermission(Permission.HIGH_LOW_NEWS_CREATE)
  @ApiBearerAuth('access-token')
  async create(@Body() apiCreateNewDTO: ApiCreateNewsDTO) {
    return await this.apiNewsService.create(apiCreateNewDTO)
  }

  @Get('/export')
  @CheckPermission(Permission.HIGH_LOW_NEWS_READ)
  async export(@Query() listNewDTO: ListNewsDTO) {
    return await this.apiNewsService.export(listNewDTO)
  }

  @Get('/')
  @CheckPermission(Permission.HIGH_LOW_NEWS_READ)
  @ApiBearerAuth('access-token')
  async findAll(@Query() listNewDTO: ListNewsDTO) {
    return await this.apiNewsService.findAll(listNewDTO)
  }

  @Get('/:id')
  @CheckPermission(Permission.HIGH_LOW_NEWS_READ)
  @ApiBearerAuth('access-token')
  async findOneById(@Param() findOneByIdDTO: FindOneByIdDTO) {
    return await this.apiNewsService.findOneById(findOneByIdDTO)
  }

  @Patch('/:id')
  @CheckPermission(Permission.HIGH_LOW_NEWS_UPDATE)
  @ApiBearerAuth('access-token')
  async update(
    @Param('id') id: string,
    @Body() apiUpdateNewDTO: ApiUpdateNewsDTO,
  ) {
    return await this.apiNewsService.update(+id, apiUpdateNewDTO)
  }

  @Delete('/:id')
  @CheckPermission(Permission.HIGH_LOW_NEWS_DELETE)
  @ApiBearerAuth('access-token')
  async delete(@Param() deleteDTO: DeleteNewsDTO) {
    return await this.apiNewsService.delete(deleteDTO)
  }
}
