import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Permission } from '../permissions/permission.data'
import { CheckPermission } from '../permissions/permission.decorator'
import { ApiMissionService } from './api-mission.service'
import { CreateMissionDto } from './dto/create-mission.dto'
import { GetMissionsDto } from './dto/get-mission.dto'
import { UpdateMissionDto } from './dto/update-mission.dto'

@ApiTags('Mission')
@ApiBearerAuth('access-token')
@Controller('mission')
export class ApiMissionController {
  constructor(private readonly missionService: ApiMissionService) {}

  @Post('/')
  @ApiOperation({ summary: 'Create new mission' })
  @CheckPermission(Permission.MISSION_CREATE)
  @HttpCode(HttpStatus.OK)
  async create(@Body() params: CreateMissionDto) {
    const res = await this.missionService.create(params)

    if (res.success) return { data: res.mission }
    throw new HttpException(res.message, HttpStatus.BAD_REQUEST)
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update a mission' })
  @CheckPermission(Permission.MISSION_UPDATE)
  async update(@Param('id') id: number, @Body() dto: UpdateMissionDto) {
    const res = await this.missionService.update(id, dto)

    if (res.success) return res.mission
    throw new HttpException(res.message, HttpStatus.BAD_REQUEST)
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get mission by id' })
  @CheckPermission(Permission.MISSION_READ)
  async getDetail(@Param('id') id: number) {
    return await this.missionService.findOne(id)
  }

  @Get('/')
  @ApiOperation({ summary: 'Get missions by campaignId' })
  @CheckPermission(Permission.MISSION_READ)
  async getMissions(@Query() query: GetMissionsDto) {
    return await this.missionService.getMissions(query)
  }
}
