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
import { Permission } from '../../permissions/permission.data'
import { CheckPermission } from '../../permissions/permission.decorator'
import {
  CreateBlockUserDTO,
  DeleteBlockUserDTO,
  FindOneByIdDTO,
  ListBlockUserDTO,
} from './block-user.dto'
import { BlockUserService } from './block-user.service'

@ApiTags('BO Block User')
@Controller('bo')
export class BlockUserController {
  constructor(private readonly blockUserService: BlockUserService) {}

  @Get('/block-user/export')
  @CheckPermission(Permission.HIGH_LOW_BLOCK_USER_READ)
  @ApiBearerAuth('access-token')
  async export(@Query() listBlockUserDto: ListBlockUserDTO) {
    return await this.blockUserService.export(listBlockUserDto)
  }

  @Get('/block-user')
  @CheckPermission(Permission.HIGH_LOW_BLOCK_USER_READ)
  @ApiBearerAuth('access-token')
  async findAll(@Query() listBlockUserDto: ListBlockUserDTO) {
    return await this.blockUserService.findAll(listBlockUserDto)
  }

  @Get('/block-user/:id')
  @CheckPermission(Permission.HIGH_LOW_BLOCK_USER_READ)
  @ApiBearerAuth('access-token')
  async findOneById(@Param() findOneByIdDto: FindOneByIdDTO) {
    return await this.blockUserService.findOneById(findOneByIdDto)
  }

  @Post('/block-user')
  @CheckPermission(Permission.HIGH_LOW_BLOCK_USER_CREATE)
  @ApiBearerAuth('access-token')
  async create(@Body() apiCreateBlockUserDto: CreateBlockUserDTO) {
    return await this.blockUserService.create(apiCreateBlockUserDto)
  }

  @Delete('/block-user/:id')
  @CheckPermission(Permission.HIGH_LOW_BLOCK_USER_DELETE)
  @ApiBearerAuth('access-token')
  async delete(@Param() deleteDto: DeleteBlockUserDTO) {
    return await this.blockUserService.delete(deleteDto)
  }
}
