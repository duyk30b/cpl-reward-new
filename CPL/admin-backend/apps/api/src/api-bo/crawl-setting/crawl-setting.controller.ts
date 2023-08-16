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
  ApiCreateBOCrawlSettingDTO,
  ApiDeleteBOCrawlSettingDTO,
  ApiUpdateBOCrawlSettingDTO,
} from './crawl-setting.dto'
import { CrawlSettingService } from './crawl-setting.service'

@ApiTags('Crawl Setting')
@Controller('bo/setting')
export class CrawlSettingController {
  constructor(private readonly boCrawlSettingService: CrawlSettingService) {}

  @Get('/crawl-settings')
  @CheckPermission(Permission.HIGH_LOW_CRAWL_SETTING_READ)
  @ApiBearerAuth('access-token')
  async getBOCrawlSetting(@Query() filter) {
    return await this.boCrawlSettingService.getBOCrawlSetting(filter)
  }

  @Post('/crawl-settings')
  @CheckPermission(Permission.HIGH_LOW_CRAWL_SETTING_CREATE)
  @ApiBearerAuth('access-token')
  async createBOCrawlSetting(
    @Body() apiCreateBOCrawlSettingDTO: ApiCreateBOCrawlSettingDTO,
  ) {
    return await this.boCrawlSettingService.createBOCrawlSetting(
      apiCreateBOCrawlSettingDTO,
    )
  }

  @Patch('/crawl-settings')
  @CheckPermission(Permission.HIGH_LOW_CRAWL_SETTING_UPDATE)
  @ApiBearerAuth('access-token')
  async updateBOCrawlSettings(
    @Body() apiUpdateBOCrawlSettingDTO: ApiUpdateBOCrawlSettingDTO[],
  ) {
    return await this.boCrawlSettingService.updateBOCrawlSettings(
      apiUpdateBOCrawlSettingDTO,
    )
  }

  @Patch('/crawl-settings/:id')
  @CheckPermission(Permission.HIGH_LOW_CRAWL_SETTING_UPDATE)
  @ApiBearerAuth('access-token')
  async updateBOCrawlSetting(
    @Body() apiUpdateBOCrawlSettingDTO: ApiUpdateBOCrawlSettingDTO,
  ) {
    return await this.boCrawlSettingService.updateBOCrawlSetting(
      apiUpdateBOCrawlSettingDTO,
    )
  }

  @Delete('/crawl-settings/:id')
  @CheckPermission(Permission.HIGH_LOW_CRAWL_SETTING_DELETE)
  @ApiBearerAuth('access-token')
  async deleteBOCrawlSetting(
    @Param() apiDeleteBOCrawlSettingDTO: ApiDeleteBOCrawlSettingDTO,
  ) {
    return await this.boCrawlSettingService.deleteBOCrawlSetting(
      apiDeleteBOCrawlSettingDTO,
    )
  }
}
