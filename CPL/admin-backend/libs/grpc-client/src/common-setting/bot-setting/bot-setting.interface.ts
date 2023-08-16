import { Observable } from 'rxjs'
import { CheckBotByIdRequest, CheckBotByIdResponse } from './bot-setting.dto'

export interface IBotSettingService {
  checkBotById: (
    request: CheckBotByIdRequest,
  ) => Observable<CheckBotByIdResponse>
}
