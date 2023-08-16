import { HttpStatus, Injectable } from '@nestjs/common'
import { AccessTokenService } from '@lib/authorization'
import { AclEmqxDto, AuthEmqxDto } from './auth-emqx.dto'
import { RedisService } from '@lib/redis'
import { AccessEmqx } from './auth-emqx.enum'
import { ConfigService } from '@nestjs/config'
import { BusinessException, TokenError } from '@lib/util'

@Injectable()
export class AuthEmqxService {
  constructor(
    private readonly accessTokenService: AccessTokenService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  async auth(authEmqxDto: AuthEmqxDto) {
    // save password to redis
    if (authEmqxDto.password) {
      this.redisService.set(
        `emqx_auth_${authEmqxDto.username}`,
        authEmqxDto.password,
        100,
      )
    }
    return true
  }

  async acl(aclEmqxDto: AclEmqxDto) {
    // allow any user to subscribed
    if (aclEmqxDto.access === AccessEmqx.SUBSCRIBE) {
      // TODO: check private topic subscribe
      return true

      // Validate JWT
      const password = await this.redisService.get(
        `emqx_auth_${aclEmqxDto.username}`,
      )
      if (!password) {
        throw new BusinessException(TokenError.INVALID, HttpStatus.UNAUTHORIZED)
      }
      const decoded = this.accessTokenService.verify(password.toString())
      if (
        decoded.uid != aclEmqxDto.username ||
        decoded.uid != aclEmqxDto.clientid
      ) {
        throw new BusinessException(TokenError.INVALID, HttpStatus.UNAUTHORIZED)
      }

      return true
    } else if (aclEmqxDto.access == AccessEmqx.PUBLISH) {
      const emqxListIpPub = this.configService
        .get('emqx_list_ip_pub')
        .split(',')
      // Check IP address private or public
      const ipaddrs = aclEmqxDto.ipaddr.split('.')
      if (!emqxListIpPub.includes(`${ipaddrs[0]}.${ipaddrs[1]}`)) {
        throw new BusinessException(
          TokenError.EMQX_INVALID_IP_PUB,
          HttpStatus.UNAUTHORIZED,
        )
      }
      return true
    }
    throw new BusinessException(
      TokenError.EMQX_INVALID_ACCESS,
      HttpStatus.UNAUTHORIZED,
    )
  }
}
