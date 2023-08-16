import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { CommonSettingConstant } from '../common-setting.constant'
import { ILanguageSetting } from './language-setting.interface'
import {
  LanguagesByTypeResponse,
  AdminTranslateByKeysRequest,
  AdminTranslateByKeysResponse,
  GetTranslatesResponse,
  IGetLanguagesSettingDto,
  IGetTranslateSettingDto,
  LanguageSettingDto,
  LanguagesSettingResponse,
  TranslateAdminSettingDto,
  TranslatesAdminSettingDto,
  KeyNameLanguageCodeResponse,
} from '@lib/grpc-client/common-setting/language-setting/language-setting.dto'
import { lastValueFrom, map } from 'rxjs'
import { plainToInstance } from 'class-transformer'

@Injectable()
export class LanguageSettingService implements OnModuleInit {
  // private readonly logger = new Logger(LanguageSettingService.name)
  private languageSetting: ILanguageSetting

  constructor(
    @Inject(CommonSettingConstant.GRPC_LANGUAGE_SETTING_TOKEN)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.languageSetting = this.client.getService<ILanguageSetting>(
      CommonSettingConstant.GRPC_LANGUAGE_SETTING_SERVICE,
    )
  }

  public setTranslate(
    input: TranslateAdminSettingDto,
  ): Promise<TranslateAdminSettingDto> {
    return lastValueFrom(
      this.languageSetting
        .setTranslate(input)
        .pipe(
          map((result) => plainToInstance(TranslateAdminSettingDto, result)),
        ),
    )
  }

  public setTranslates(
    data: TranslateAdminSettingDto[],
  ): Promise<TranslatesAdminSettingDto> {
    const input = {
      data,
    }

    return lastValueFrom(
      this.languageSetting
        .setTranslates(input)
        .pipe(
          map((result) => plainToInstance(TranslatesAdminSettingDto, result)),
        ),
    )
  }

  public getTranslates(
    request: IGetTranslateSettingDto,
  ): Promise<GetTranslatesResponse> {
    return lastValueFrom(
      this.languageSetting
        .getTranslates(request)
        .pipe(map((result) => plainToInstance(GetTranslatesResponse, result))),
    )
  }

  public getAdminTranslateByKeys(
    request: AdminTranslateByKeysRequest,
  ): Promise<AdminTranslateByKeysResponse> {
    return lastValueFrom(
      this.languageSetting
        .getAdminTranslateByKeys(request)
        .pipe(
          map((result) =>
            plainToInstance(AdminTranslateByKeysResponse, result),
          ),
        ),
    )
  }

  public getAllAdminTranslates(): Promise<AdminTranslateByKeysResponse> {
    return lastValueFrom(
      this.languageSetting
        .getAllAdminTranslates({})
        .pipe(
          map((result) =>
            plainToInstance(AdminTranslateByKeysResponse, result),
          ),
        ),
    )
  }

  public getLanguagesSetting(
    request: IGetLanguagesSettingDto,
  ): Promise<LanguagesSettingResponse> {
    return lastValueFrom(
      this.languageSetting.getLanguagesSetting(request).pipe(
        map((result) =>
          plainToInstance(LanguagesSettingResponse, result, {
            ignoreDecorators: true,
          }),
        ),
      ),
    )
  }

  public setLanguage(input: LanguageSettingDto): Promise<LanguageSettingDto> {
    return lastValueFrom(
      this.languageSetting
        .setLanguageSetting(input)
        .pipe(map((result) => plainToInstance(LanguageSettingDto, result))),
    )
  }

  public getLanguagesByType(type = ''): Promise<LanguagesByTypeResponse> {
    return lastValueFrom(
      this.languageSetting
        .getLanguagesByType({ type })
        .pipe(map((result) => result)),
    )
  }

  public getKeyNameLanguageCode(): Promise<KeyNameLanguageCodeResponse> {
    return lastValueFrom(
      this.languageSetting
        .getKeyNameLanguageCode({})
        .pipe(map((result) => result)),
    )
  }

  public getPairCategoriesKey(): Promise<AdminTranslateByKeysResponse> {
    return lastValueFrom(
      this.languageSetting
        .getPairCategoriesKey({})
        .pipe(
          map((result) =>
            plainToInstance(AdminTranslateByKeysResponse, result),
          ),
        ),
    )
  }
}
