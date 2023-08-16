import { Injectable, Logger } from '@nestjs/common'
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer'
import { renderTemplate } from '@libs/mail/mail.helper'
import { ConfigService } from '@nestjs/config'
import { DEFAULT_LANG } from '@libs/common'

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name)
  private readonly subjectPrefix: string

  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {
    this.subjectPrefix = this.configService.get('mail.subject_prefix')
  }

  async send(
    toAddress: string,
    subject: string,
    templateFile: string,
    variables,
    lang: string = DEFAULT_LANG,
  ): Promise<void> {
    const html = renderTemplate(templateFile, variables, lang)
    const params: ISendMailOptions = {
      to: toAddress,
      subject: `${this.subjectPrefix} ${subject}`,
      html: html,
    }

    await this.mailerService.sendMail(params)
  }

  async sendWithTransporter(
    transporterName: string,
    toAddress: string,
    subject: string,
    templateFile: string,
    variables,
    lang = DEFAULT_LANG,
  ) {
    const html = renderTemplate(templateFile, variables, lang)
    const params: ISendMailOptions = {
      transporterName: transporterName,
      to: toAddress,
      subject: `${this.subjectPrefix} ${subject}`,
      html: html,
    }

    await this.mailerService.sendMail(params)
  }

  async sendHtml(
    toAddress: string,
    subject: string,
    html: string,
  ): Promise<void> {
    const params: ISendMailOptions = {
      to: toAddress,
      subject: `${this.subjectPrefix} ${subject}`,
      html: html,
    }

    await this.mailerService.sendMail(params)
  }

  async sendHtmlWithTransporter(
    transporterName: string,
    toAddress: string,
    subject: string,
    html: string,
  ) {
    const params: ISendMailOptions = {
      transporterName: transporterName,
      to: toAddress,
      subject: `${this.subjectPrefix} ${subject}`,
      html: html,
    }

    await this.mailerService.sendMail(params)
  }
}
