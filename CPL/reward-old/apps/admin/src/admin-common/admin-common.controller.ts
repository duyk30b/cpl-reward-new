import { Controller } from '@nestjs/common'
import { AdminCommonService } from './admin-common.service'
import { GrpcMethod } from '@nestjs/microservices'
import { CreateActionLogInput } from './admin-common.interface'
import {
  INFO_EVENTS,
  LIST_GRANT_METHODS,
  LIST_GRANT_TARGET_USERS,
  LIST_GRANT_TARGET_WALLETS,
  LIST_PROPERTY_TO_CALCULATE_AMOUNT,
  USER_CONDITION_TYPES,
} from '@lib/mission'
import { ListEventsDto, UserConditionListDto } from './admin-common.dto'
import { plainToInstance } from 'class-transformer'

@Controller('common')
export class AdminCommonController {
  constructor(private readonly adminCommonService: AdminCommonService) {}

  @GrpcMethod('GrpcAdminCommonService', 'CreateActionLog')
  async createActionLog(data: CreateActionLogInput): Promise<any> {
    return await this.adminCommonService.createLogAction(data)
  }

  @GrpcMethod('GrpcAdminCommonService', 'ListEvents')
  listEvents() {
    const events = INFO_EVENTS
    return plainToInstance(ListEventsDto, { events })
  }

  @GrpcMethod('GrpcAdminCommonService', 'ListGrantTarget')
  listGrantTarget() {
    const wallets = LIST_GRANT_TARGET_WALLETS()
    const users = LIST_GRANT_TARGET_USERS
    const methods = LIST_GRANT_METHODS
    const propertiesToCalculateAmount = LIST_PROPERTY_TO_CALCULATE_AMOUNT
    return { users, wallets, methods, propertiesToCalculateAmount }
  }

  @GrpcMethod('GrpcAdminCommonService', 'ListUserConditions')
  listUserConditions() {
    return plainToInstance(UserConditionListDto, {
      list: USER_CONDITION_TYPES,
    })
  }

  @GrpcMethod('GrpcAdminCommonService', 'ListDisplayConditions')
  listDisplayConditions() {
    return plainToInstance(UserConditionListDto, {
      list: {
        account_lv: USER_CONDITION_TYPES.account_lv,
        kyc_verify_status: USER_CONDITION_TYPES.kyc_verify_status,
        user_info_status: USER_CONDITION_TYPES.user_info_status,
        id: USER_CONDITION_TYPES.id,
      },
    })
  }
}
