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
  ApiCreatePairPriceDTO,
  ApiUpdatePairPriceDTO,
  DeletePairPriceDTO,
  FindOneByIdDTO,
  ListPairPriceDTO,
} from './pair-price.dto'
import { PairPriceService } from './pair-price.service'

@ApiTags('BO Pair Price')
@Controller('bo/pair-prices')
export class PairPriceController {
  constructor(private readonly apiPairPriceService: PairPriceService) {}

  @Post('/')
  @CheckPermission(Permission.HIGH_LOW_PAIR_PRICE_CREATE)
  @ApiBearerAuth('access-token')
  async create(@Body() apiCreatePairPriceDTO: ApiCreatePairPriceDTO) {
    return await this.apiPairPriceService.create(apiCreatePairPriceDTO)
  }

  @Get('/')
  @CheckPermission(Permission.HIGH_LOW_PAIR_PRICE_READ)
  //@ApiBearerAuth('access-token')
  async findAll(@Query() listPairPriceDTO: ListPairPriceDTO) {
    return await this.apiPairPriceService.findAll(listPairPriceDTO)
  }

  @Get('/:id')
  @CheckPermission(Permission.HIGH_LOW_PAIR_PRICE_READ)
  @ApiBearerAuth('access-token')
  async findOneById(@Param() findOneByIdDTO: FindOneByIdDTO) {
    return await this.apiPairPriceService.findOneById(findOneByIdDTO)
  }

  @Patch('/:id')
  @CheckPermission(Permission.HIGH_LOW_PAIR_PRICE_UPDATE)
  @ApiBearerAuth('access-token')
  async update(
    @Param('id') id: string,
    @Body() apiUpdatePairPriceDTO: ApiUpdatePairPriceDTO,
  ) {
    return await this.apiPairPriceService.update(+id, apiUpdatePairPriceDTO)
  }

  @Delete('/:id')
  @CheckPermission(Permission.HIGH_LOW_PAIR_PRICE_DELETE)
  @ApiBearerAuth('access-token')
  async delete(@Param() deleteDTO: DeletePairPriceDTO) {
    return await this.apiPairPriceService.delete(deleteDTO)
  }
}
