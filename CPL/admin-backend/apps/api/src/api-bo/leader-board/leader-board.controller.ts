import { Body, Controller, Put } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Permission } from '../../permissions/permission.data'
import { CheckPermission } from '../../permissions/permission.decorator'
import { DeleteRequestDto } from './leader-board.dto'
import { LeaderBoardService } from './leader-board.service'

@ApiTags('BO Leader board')
@Controller('bo/leader-board')
export class LeaderBoardController {
  constructor(private readonly leaderBoardService: LeaderBoardService) {}

  @Put()
  @CheckPermission(Permission.HIGH_LOW_SETTING_DELETE)
  @ApiBearerAuth('access-token')
  async delete(@Body() deleteRequestDto: DeleteRequestDto) {
    return await this.leaderBoardService.delete(deleteRequestDto)
  }
}
