import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Permission } from '../../permissions/permission.data'
import { CheckPermission } from '../../permissions/permission.decorator'
import {
  CreateUserGrantPayoutDTO,
  DeleteUserGrantPayoutDTO,
  FindOneByIdDTO,
  ListUserGrantPayoutDTO,
  UpdateUserGrantPayoutDTO,
} from './user-grant-payout.dto'
import { UserGrantPayoutService } from './user-grant-payout.service'

@ApiTags('BO User Grant Payout')
@Controller('bo/user-grant-payout')
export class UserGrantPayoutController {
  constructor(
    private readonly userGrantPayoutService: UserGrantPayoutService,
  ) {}

  @Get('/export')
  @CheckPermission(Permission.HIGH_LOW_USER_GRANT_PAYOUT_READ)
  @ApiBearerAuth('access-token')
  async export(@Query() listUserGrantPayoutDto: ListUserGrantPayoutDTO) {
    return await this.userGrantPayoutService.export(listUserGrantPayoutDto)
  }

  @Get('/')
  @CheckPermission(Permission.HIGH_LOW_USER_GRANT_PAYOUT_READ)
  @ApiBearerAuth('access-token')
  async findAll(@Query() listUserGrantPayoutDto: ListUserGrantPayoutDTO) {
    return await this.userGrantPayoutService.findAll(listUserGrantPayoutDto)
  }

  @Get('/:id')
  @CheckPermission(Permission.HIGH_LOW_USER_GRANT_PAYOUT_READ)
  @ApiBearerAuth('access-token')
  async findOneById(@Param() findOneByIdDto: FindOneByIdDTO) {
    return await this.userGrantPayoutService.findOneById(findOneByIdDto)
  }

  @Post('/')
  @CheckPermission(Permission.HIGH_LOW_USER_GRANT_PAYOUT_CREATE)
  @ApiBearerAuth('access-token')
  async create(@Body() apiCreateUserGrantPayoutDto: CreateUserGrantPayoutDTO) {
    return await this.userGrantPayoutService.create(apiCreateUserGrantPayoutDto)
  }

  @Put('/:userId')
  @CheckPermission(Permission.HIGH_LOW_USER_GRANT_PAYOUT_UPDATE)
  @ApiBearerAuth('access-token')
  async update(
    @Param('userId') userId: number,
    @Body() apiUpdateUserGrantPayoutDto: UpdateUserGrantPayoutDTO,
  ) {
    return await this.userGrantPayoutService.update(
      apiUpdateUserGrantPayoutDto,
      userId,
    )
  }

  @Delete('/:id')
  @CheckPermission(Permission.HIGH_LOW_USER_GRANT_PAYOUT_DELETE)
  @ApiBearerAuth('access-token')
  async delete(@Param() deleteDto: DeleteUserGrantPayoutDTO) {
    return await this.userGrantPayoutService.delete(deleteDto)
  }
}
