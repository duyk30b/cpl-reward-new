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
  CreateUnlimitedUserDTO,
  UpdateUnlimitedUserDTO,
  DeleteUnlimitedUserDTO,
  FindOneByIdDTO,
  ListUnlimitedUserDTO,
  FilterQueryDTO,
} from './unlimited-user.dto'
import { UnlimitedUserService } from './unlimited-user.service'

@ApiTags('BO Unlimited User')
@Controller('bo')
export class UnlimitedUserController {
  constructor(private readonly unlimitedUserService: UnlimitedUserService) {}

  @Get('/unlimited-user/export')
  @CheckPermission(Permission.HIGH_LOW_UNLIMITED_USER_READ)
  @ApiBearerAuth('access-token')
  async export(@Query() listUnlimitedUserDto: ListUnlimitedUserDTO) {
    return await this.unlimitedUserService.export(listUnlimitedUserDto)
  }

  @Get('/unlimited-user')
  @CheckPermission(Permission.HIGH_LOW_UNLIMITED_USER_READ)
  @ApiBearerAuth('access-token')
  async findAll(@Query() listUnlimitedUserDto: ListUnlimitedUserDTO) {
    return await this.unlimitedUserService.findAll(listUnlimitedUserDto)
  }

  @Get('/unlimited-user/:id')
  @CheckPermission(Permission.HIGH_LOW_UNLIMITED_USER_READ)
  @ApiBearerAuth('access-token')
  async findOneById(@Param() findOneByIdDto: FindOneByIdDTO) {
    return await this.unlimitedUserService.findOneById(findOneByIdDto)
  }

  @Post('/unlimited-user')
  @CheckPermission(Permission.HIGH_LOW_UNLIMITED_USER_CREATE)
  @ApiBearerAuth('access-token')
  async create(@Body() apiCreateUnlimitedUserDto: CreateUnlimitedUserDTO) {
    return await this.unlimitedUserService.create(apiCreateUnlimitedUserDto)
  }

  @Patch('/unlimited-user/:id')
  @CheckPermission(Permission.HIGH_LOW_UNLIMITED_USER_UPDATE)
  @ApiBearerAuth('access-token')
  async update(
    @Param('id') id: number,
    @Body() apiUpdateUnlimitedUserDto: UpdateUnlimitedUserDTO,
  ) {
    return await this.unlimitedUserService.update(id, apiUpdateUnlimitedUserDto)
  }

  @Delete('/unlimited-user/:id')
  @CheckPermission(Permission.HIGH_LOW_UNLIMITED_USER_DELETE)
  @ApiBearerAuth('access-token')
  async delete(@Param() deleteDto: DeleteUnlimitedUserDTO) {
    return await this.unlimitedUserService.delete(deleteDto)
  }

  @Get('/searchUserVerified')
  @CheckPermission(Permission.HIGH_LOW_UNLIMITED_USER_READ)
  @ApiBearerAuth('access-token')
  async findAllVerified(@Query() query: FilterQueryDTO) {
    return await this.unlimitedUserService.findAllVerified(query)
  }
}
