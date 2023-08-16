import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { IRequestWithAccessToken } from '../interfaces/request-with-access-token'
import { Permission } from '../permissions/permission.data'
import { CheckPermission } from '../permissions/permission.decorator'
import { CreateUserNoteDto } from './api-user-note.dto'
import { ApiUserNoteService } from './api-user-note.service'

@ApiTags('user-note')
@Controller('user-note')
export class ApiUserNoteController {
  constructor(private readonly apiUserNoteService: ApiUserNoteService) {}

  @Get(':user_id')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_NOTE_READ)
  async findByUserId(@Param('user_id') userId: string) {
    return await this.apiUserNoteService.findByUserId(userId)
  }

  @Post(':user_id')
  @ApiBearerAuth('access-token')
  @CheckPermission(Permission.USER_NOTE_CREATE)
  async create(
    @Param('user_id') userId: string,
    @Body() createDto: CreateUserNoteDto,
    @Req() req: IRequestWithAccessToken,
  ) {
    return await this.apiUserNoteService.create(
      req.accessTokenInfo.uid,
      userId,
      createDto,
    )
  }
}
