import { Body, Controller, Post, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiFireService } from './api-fire.service'
import { FireCheckInQuery } from './request/fire-check-in.request'
import { FireKafkaBody, FireKafkaQuery } from './request/fire-kafka.request'

@ApiTags('Fire')
@Controller('fire')
export class ApiFireController {
  constructor(private readonly apiFireService: ApiFireService) {}

  @Post('fire-kafka')
  async fireKafka(@Query() query: FireKafkaQuery, @Body() body: FireKafkaBody) {
    this.apiFireService.startFireKafka(query, body)
    return { success: true }
  }

  @Post('fire-check-in')
  async fireCheckIn(@Query() query: FireCheckInQuery) {
    this.apiFireService.fireCheckIn(query)
    return { success: true }
  }
}
