import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AclEmqxDto, AuthEmqxDto } from './auth-emqx.dto'
import { Request } from 'express'
import { AuthEmqxService } from './auth-emqx.service'

@ApiTags('auth-emqx')
@Controller('auth-emqx')
export class AuthEmqxController {
  constructor(private readonly authEmqxService: AuthEmqxService) {}

  @Post('auth')
  @HttpCode(HttpStatus.OK)
  async auth(@Req() request: Request, @Body() authEmqxDto: AuthEmqxDto) {
    return await this.authEmqxService.auth(authEmqxDto)
  }

  @Post('acl')
  @HttpCode(HttpStatus.OK)
  async acl(@Req() request: Request, @Body() aclEmqxDto: AclEmqxDto) {
    return await this.authEmqxService.acl(aclEmqxDto)
  }
}
