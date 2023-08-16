import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Observable } from 'rxjs'
import { BusinessException, FuturesErrors } from '@lib/util'

@Injectable()
export class InvisibleInProdGuard implements CanActivate {
  private logger = new Logger(InvisibleInProdGuard.name)

  constructor(private readonly configService: ConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const env = this.configService.get<string>('global.env')

    if (env === undefined) {
      this.logger.error('[FUTURE] env was not exist')
    }

    if (env === undefined || ['local', 'dev', 'stg-v2'].includes(env))
      return true

    throw new BusinessException(
      FuturesErrors.URL_NOT_FOUND,
      HttpStatus.NOT_FOUND,
    )
  }
}
