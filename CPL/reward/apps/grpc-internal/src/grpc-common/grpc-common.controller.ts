import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import {
  DisplayConditionSettings,
  GrantTargetSettings,
  JudgmentConditionSettings,
  UserConditionSettings,
} from './settings'

@Controller('common')
export class GrpcCommonController {
  @GrpcMethod('GrpcAdminCommonService', 'ListEvents')
  listEvents() {
    let events = JSON.parse(JSON.stringify(JudgmentConditionSettings))
    events = Object.entries(events).map(([key, value]) => ({
      eventName: key,
      properties: (value as any).map((item) => {
        if (item.options) {
          item.options = JSON.stringify(item.options)
        }
        return item
      }),
    }))
    return { events }
  }

  @GrpcMethod('GrpcAdminCommonService', 'ListGrantTarget')
  listGrantTarget() {
    const target = JSON.parse(JSON.stringify(GrantTargetSettings))
    return target
  }

  @GrpcMethod('GrpcAdminCommonService', 'ListUserConditions')
  listUserConditions() {
    const list = JSON.parse(JSON.stringify(UserConditionSettings))
    Object.values(list).forEach((item: any) => {
      if (item.options) {
        item.options = JSON.stringify(item.options)
      }
    })

    return { list }
  }

  @GrpcMethod('GrpcAdminCommonService', 'ListDisplayConditions')
  listDisplayConditions() {
    const list = JSON.parse(JSON.stringify(DisplayConditionSettings))

    Object.values(list).forEach((item: any) => {
      if (item.options) {
        item.options = JSON.stringify(item.options)
      }
    })

    return { list }
  }
}
