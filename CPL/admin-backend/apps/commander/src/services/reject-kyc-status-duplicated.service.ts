import { Command } from 'nest-commander'
import { Logger } from '@nestjs/common'
import {
  BanUserHistoryService,
  STATUS,
  STATUS_NOTE,
} from '@lib/ban-user-history'
import { RejectKycReasonArray, UserKycService } from '@lib/grpc-client/user-kyc'

const commandName = 'reject-kyc:duplicated'

@Command({ name: commandName })
export class RejectKycStatusDuplicatedService {
  private readonly logger = new Logger(RejectKycStatusDuplicatedService.name)

  constructor(
    private readonly banUserHistoryService: BanUserHistoryService,
    private readonly userKycService: UserKycService,
  ) {}

  async run(): Promise<void> {
    this.logger.log(`${commandName} => START`)
    // const bannedUserLogs = await this.banUserHistoryService.findAll({
    //   status: STATUS.DUPLICATED_BANNED,
    //   note: STATUS_NOTE.DUPLICATED_BANNED,
    // })
    // if (bannedUserLogs.length === 0) {
    //   this.logger.log(`${commandName} => No Logs`)
    //   return
    // }

    // for (const index in bannedUserLogs) {
    //   const bannedUserLog = bannedUserLogs[index]
    //   let externalResponse
    //   if (bannedUserLog.externalResponse !== null) {
    //     externalResponse = JSON.parse(bannedUserLog.externalResponse)
    //   } else {
    //     externalResponse = {
    //       rejectKyc: {},
    //     }
    //   }

    //   const rejectKycResult = await this.userKycService.rejectKyc({
    //     userId: bannedUserLog.userId,
    //     rejectionReasons: RejectKycReasonArray,
    //   })
    //   this.logger.log(
    //     `${commandName} => userId: ${
    //       bannedUserLog.userId
    //     }, response: ${JSON.stringify(rejectKycResult)}`,
    //   )
    //   if (!rejectKycResult.success) {
    //     bannedUserLog.note = rejectKycResult.message
    //   }
    //   externalResponse.rejectKyc = rejectKycResult

    //   bannedUserLog.externalResponse = JSON.stringify(externalResponse)
    //   await this.banUserHistoryService.update(bannedUserLog)
    // }
    this.logger.log(`${commandName} => DONE`)
  }
}
