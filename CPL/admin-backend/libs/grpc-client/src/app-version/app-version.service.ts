import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { plainToInstance } from 'class-transformer'
import { catchError, lastValueFrom, map } from 'rxjs'
import { Constants } from './constants'
import { AppVersion } from './dtos/app-version.dto'
import { IGrpcAppVersion } from './grpc-app-version.interface'

@Injectable()
export class AppVersionService implements OnModuleInit {
  private readonly logger: Logger = new Logger(AppVersionService.name)
  private appVersionSetting: IGrpcAppVersion

  constructor(
    @Inject(Constants.GRPC_APP_VERSION_SETTING_TOKEN)
    private readonly clientGrpc: ClientGrpc,
  ) {}

  public onModuleInit() {
    this.appVersionSetting = this.clientGrpc.getService(
      Constants.GRPC_APP_VERSION_SETTING_SERVICE,
    )
  }

  public async getAppVersions(platform: string): Promise<AppVersion[]> {
    return lastValueFrom(
      this.appVersionSetting
        .getAppVersions({
          platform: platform,
        })
        .pipe(
          map((result) => plainToInstance(AppVersion, result.data) ?? []),
          catchError((error) => {
            this.logger.error(error)
            throw error
          }),
        ),
    )
  }

  public async saveAppVersion(appVersion: AppVersion): Promise<AppVersion> {
    return lastValueFrom(
      this.appVersionSetting.saveAppVersion(appVersion).pipe(
        map((result) => plainToInstance(AppVersion, result)),
        catchError((error) => {
          this.logger.error(error)
          throw error
        }),
      ),
    )
  }

  public async deleteAppVersion(appVersion: AppVersion): Promise<AppVersion> {
    return lastValueFrom(
      this.appVersionSetting.deleteAppVersion(appVersion).pipe(
        map((result) => plainToInstance(AppVersion, result)),
        catchError((error) => {
          this.logger.error(error)
          throw error
        }),
      ),
    )
  }
}
