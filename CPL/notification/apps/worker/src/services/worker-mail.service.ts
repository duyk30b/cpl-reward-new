import { UserService } from '@libs/grpc-client'
import { MailService } from '@libs/mail/mail.service'
import { Injectable, Logger } from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'
import { IMailCommand } from '@libs/redis'
import { UserSettingService } from '@libs/user-setting'
import { MailLogService } from '@libs/noti-log/services/mail-log.service'
import { DEFAULT_LANG, isSupportedLang } from '@libs/common'

@Injectable()
export class WorkerMailService {
  private readonly logger = new Logger(WorkerMailService.name)
  constructor(
    private readonly mailService: MailService,
    private readonly userService: UserService,
    private readonly i18n: I18nService,
    private readonly userSettingService: UserSettingService,
    private readonly mailLogService: MailLogService,
  ) {}

  async handleMailCommand(command: IMailCommand) {
    let email = command.email
    const { userId, template, data } = command
    let lang = command.lang

    if (userId) {
      const user = await this.userService.findById(command.userId)
      email = user.email

      if (!lang) lang = await this.userSettingService.getLocale(userId)
    }
    if (!email) return
    if (!isSupportedLang(lang)) lang = DEFAULT_LANG

    let success = false
    let error = null
    try {
      if (template.file) {
        const subject = await this.i18n.translate(
          `notification.${template.subject}`,
          {
            lang: lang,
            args: data,
          },
        )
        await this.mailService.send(email, subject, template.file, data, lang)
      } else if (template.html) {
        await this.mailService.sendHtml(email, template.subject, template.html)
      }
      success = true
    } catch (e) {
      this.logger.error(e, e.stack)
      error = e.stack
    }

    try {
      await this.mailLogService.saveLog({
        userId,
        email,
        data: command,
        success,
        error,
      })
    } catch (e) {
      this.logger.error(`Fail to save mail log of email: ${email}`)
      this.logger.log(e, e.stack)
    }
  }
}
