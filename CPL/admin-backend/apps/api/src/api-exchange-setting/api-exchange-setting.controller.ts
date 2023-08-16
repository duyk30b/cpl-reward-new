import { BasePaginationQueryDto } from '@app/common/base-pagination.dto'
import { TransformRpcExceptionInterceptor } from '@app/common/transform-rpc-exception.interceptor'
import { IAccessTokenPayload } from '@lib/authorization/interfaces/access-token-payload.interface'
import {
  GetListCoinNameRequest,
  GrpcCoinSettingPaginationResponse,
} from '@lib/grpc-client/exchange-setting/dtos/coin/'
import {
  CreatePairCategoryItemDto,
  DeletePairCategoryResponseDto,
  DeletePairCategorySettingDto,
  GetPairCategorySettingDto,
  GrpcPairCategorySettingPaginationResponse,
  PairCategorySettingDto,
  UpdateOrderCategoryRequestDto,
  UpdateOrderCategoryResponse,
  UpdatePairCategoryItemDto,
  UpdatePairCategoryResponseDto,
} from '@lib/grpc-client/exchange-setting/dtos/pair-category-setting'
import {
  CreateSubCategoryRequestDto,
  DeleteSubCategoryDto,
  GetSubCategoryByParentId,
  UpdateOrderSubCategoryRequestDto,
  UpdateSubCategoryRequestDto,
} from '@lib/grpc-client/exchange-setting/dtos/pair-category-setting/sub-category-input.dto'
import {
  DeleteSubPairCategoryResponse,
  SubCategoryResponseDto,
} from '@lib/grpc-client/exchange-setting/dtos/pair-category-setting/sub-category.dto'
import {
  CreatePairSettingItemDto,
  GetPairSettingPaginationDto,
  GrpcListPairNameResponse,
  GrpcPairSettingPaginationResponse,
  PairSettingFilterDto,
  PairSettingParamsDto,
  PairSettingWithOBMDto,
  UpdatePairSettingItemDto,
} from '@lib/grpc-client/exchange-setting/dtos/pair-setting'
import {
  CoinSettingService,
  PairCategorySettingService,
  PairSettingService,
} from '@lib/grpc-client/exchange-setting/services'
import { SubCategorySettingService } from '@lib/grpc-client/exchange-setting/services/sub-category-setting.service'
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { instanceToPlain } from 'class-transformer'
import { TokenInformation } from '../decorators/current-user.decorator'
import { Permission } from '../permissions/permission.data'
import { CheckPermission } from '../permissions/permission.decorator'

@ApiTags('Exchange setting')
@Controller('api-exchange-setting')
@UseInterceptors(TransformRpcExceptionInterceptor)
export class ApiExchangeSettingController {
  constructor(
    private readonly coinSettingService: CoinSettingService,
    private readonly pairSettingService: PairSettingService,
    private readonly pairCategorySettingService: PairCategorySettingService,
    private readonly subCategoryService: SubCategorySettingService,
  ) {}

  //////// Coin ////////
  @Get('list-coin-name')
  @CheckPermission(Permission.AUTO_ADD_SETTING_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get list coin name' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcCoinSettingPaginationResponse })
  async getOnlyCoinName(@Query() query: GetListCoinNameRequest) {
    return instanceToPlain(await this.coinSettingService.getListCoinName(query))
  }

  //////// Pair ////////
  @Get('list-pair-name')
  @CheckPermission(Permission.PAIR_SETTINGS_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get all pair name' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcListPairNameResponse })
  public async getAllPairName() {
    return instanceToPlain(await this.pairSettingService.getListPairName())
  }

  @Get('pair')
  @CheckPermission(Permission.PAIR_SETTINGS_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get pair settings by pagination' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcPairSettingPaginationResponse })
  public async getPairs(@Query() query: GetPairSettingPaginationDto) {
    return instanceToPlain(await this.pairSettingService.getPairs(query))
  }

  @Get('list-pair')
  @CheckPermission(Permission.PAIR_SETTINGS_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get list pair settings' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: [PairSettingWithOBMDto] })
  public async getListPair(@Query() query: PairSettingFilterDto) {
    return instanceToPlain(
      await this.pairSettingService.getListPairSetting(query),
    )
  }

  @Get('pair-item')
  @CheckPermission(Permission.PAIR_SETTINGS_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get a pair setting by coin and currency' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: PairSettingWithOBMDto })
  public async getSinglePair(@Query() params: PairSettingParamsDto) {
    return instanceToPlain(
      await this.pairSettingService.getPairSetting(
        params.coin,
        params.currency,
      ),
    )
  }

  @Patch('pair')
  @CheckPermission(Permission.PAIR_SETTINGS_UPDATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Patch a pair setting' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: PairSettingWithOBMDto })
  public async updatePair(
    @TokenInformation() token: IAccessTokenPayload,
    @Body()
    editPairDto: UpdatePairSettingItemDto,
  ) {
    return await this.pairSettingService.setPairSetting(editPairDto, token.uid)
  }

  @Post('pair')
  @CheckPermission(Permission.PAIR_SETTINGS_CREATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a pair setting' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: PairSettingWithOBMDto })
  public async createPair(
    @TokenInformation() token: IAccessTokenPayload,
    @Body() createPairDto: CreatePairSettingItemDto,
  ) {
    return await this.pairSettingService.setPairSetting(
      createPairDto,
      token.uid,
    )
  }

  @Delete('pair')
  @CheckPermission(Permission.PAIR_SETTINGS_DELETE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete a pair setting' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: PairSettingParamsDto })
  public async deletePair(
    @TokenInformation() token: IAccessTokenPayload,
    @Query() query: PairSettingParamsDto,
  ) {
    return await this.pairSettingService.deletePairSetting(
      query.coin,
      query.currency,
      token.uid,
    )
  }

  // //////// Pair category ////////
  @Get('pair-category')
  @CheckPermission(Permission.PAIR_CATEGORY_SETTINGS_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get pair category settings' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcPairCategorySettingPaginationResponse })
  public async getPairCategories(@Query() query: BasePaginationQueryDto) {
    return instanceToPlain(
      await this.pairCategorySettingService.getPairCategorySetting(query),
    )
  }

  @Get('pair-category-item')
  @CheckPermission(Permission.PAIR_CATEGORY_SETTINGS_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get a pair category setting' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: PairCategorySettingDto })
  public async getPairCategoryByName(
    @Query() query: GetPairCategorySettingDto,
  ) {
    return await this.pairCategorySettingService.getPairCategorySettingById(
      query.id,
    )
  }

  @Post('pair-category')
  @CheckPermission(Permission.PAIR_CATEGORY_SETTINGS_CREATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a pair category setting' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: PairCategorySettingDto })
  public async createPairCategory(
    @Body() createPairCategory: CreatePairCategoryItemDto,
  ) {
    return instanceToPlain(
      await this.pairCategorySettingService.createPairCategoryItem(
        createPairCategory,
      ),
    )
  }

  @Patch('pair-category')
  @CheckPermission(Permission.PAIR_CATEGORY_SETTINGS_UPDATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a pair category setting' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: UpdatePairCategoryResponseDto })
  public async updatePairCategory(
    @Body() updatePairCategory: UpdatePairCategoryItemDto,
  ) {
    return instanceToPlain(
      await this.pairCategorySettingService.updatePairCategoryItem(
        updatePairCategory,
      ),
    )
  }

  @Patch('order-pair-category')
  @CheckPermission(Permission.PAIR_CATEGORY_SETTINGS_UPDATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update order pair category setting' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: UpdateOrderCategoryResponse })
  public async updateOrderPairCategory(
    @Body() updatePairCategory: UpdateOrderCategoryRequestDto,
  ) {
    return instanceToPlain(
      await this.pairCategorySettingService.updateOrderPairCategoryItem(
        updatePairCategory,
      ),
    )
  }

  @Delete('pair-category')
  @CheckPermission(Permission.PAIR_CATEGORY_SETTINGS_DELETE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete a pair category setting' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: DeletePairCategoryResponseDto })
  public async deletePairCategory(
    @Query() query: DeletePairCategorySettingDto,
  ) {
    return await this.pairCategorySettingService.deletePairCategoryItem(
      query.id,
    )
  }

  // //////// Sub pair category ////////
  @Get('sub-pair-category')
  @CheckPermission(Permission.PAIR_CATEGORY_SETTINGS_READ)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get sub pair category settings' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: GrpcPairCategorySettingPaginationResponse })
  public async getSubPairCategories(@Query() query: GetSubCategoryByParentId) {
    return instanceToPlain(
      await this.subCategoryService.getSubPairCategorySetting(query),
    )
  }

  @Post('sub-pair-category')
  @CheckPermission(Permission.PAIR_CATEGORY_SETTINGS_CREATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a sub pair category setting' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: SubCategoryResponseDto })
  public async createSubPairCategory(
    @Body() createPairCategory: CreateSubCategoryRequestDto,
  ) {
    return instanceToPlain(
      await this.subCategoryService.createSubPairCategorySetting(
        createPairCategory,
      ),
    )
  }

  @Patch('sub-pair-category')
  @CheckPermission(Permission.PAIR_CATEGORY_SETTINGS_UPDATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a sub pair category setting' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: SubCategoryResponseDto })
  public async updateSubPairCategory(
    @Body() updatePairCategory: UpdateSubCategoryRequestDto,
  ) {
    return instanceToPlain(
      await this.subCategoryService.updateSubPairCategorySetting(
        updatePairCategory,
      ),
    )
  }

  @Patch('order-sub-pair-category')
  @CheckPermission(Permission.PAIR_CATEGORY_SETTINGS_UPDATE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update order sub pair category setting' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: UpdateOrderSubCategoryRequestDto })
  public async updateOrderSubPairCategory(
    @Body() updatePairCategory: UpdateOrderSubCategoryRequestDto,
  ) {
    return instanceToPlain(
      await this.subCategoryService.updateOrderSubPairCategorySetting(
        updatePairCategory,
      ),
    )
  }

  @Delete('sub-pair-category')
  @CheckPermission(Permission.PAIR_CATEGORY_SETTINGS_DELETE)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete a sub pair category setting' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: DeleteSubPairCategoryResponse })
  public async deleteSubPairCategory(@Query() query: DeleteSubCategoryDto) {
    return await this.subCategoryService.deleteSubPairCategorySetting(query)
  }
}
