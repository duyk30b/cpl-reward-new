/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ESystemPushNotificationType } from '../libs/system-push-notification-setting/src/system-push-notification-setting.enum'
import { MigrationInterface, QueryRunner } from 'typeorm'
import { dbJsonText } from '../libs/common/src/helpers/seed.helper'

export class systemPushNotificationSettingSeeder1649390273060
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO system_push_notification_setting (type, title, content) VALUES ("kyc_completed", ${dbJsonText(
        {
          en: 'KYC verification process is now completed',
          ja: '本人確認書類審査完了のお知らせ',
        },
      )}, ${dbJsonText({
        en: 'Your submited KYC information has been {Status}.',
        ja: 'KYCの申請が{Status}されました。',
      })})`,
    )
    await queryRunner.query(
      `INSERT INTO system_push_notification_setting (type, title, content) VALUES ("${
        ESystemPushNotificationType.DEPOSIT
      }", ${dbJsonText({
        en: 'Deposit notification',
        ja: '入金のお知らせ',
      })}, ${dbJsonText({
        en: 'Your deposit on {Deposit_Quantity}{Deposit_Currency} is complete.',
        ja: '{Deposit_Quantity}{Deposit_Currency}入金完了しました。',
      })})`,
    )
    await queryRunner.query(
      `INSERT INTO system_push_notification_setting (type, title, content) VALUES ("${
        ESystemPushNotificationType.WITHDRAW_SUCCESS
      }", ${dbJsonText({
        en: 'Withdrawal notification',
        ja: '出金のお知らせ',
      })}, ${dbJsonText({
        en: `Withdraw {Withdrawal_Quantity} {Withdrawal_Currency} has been {Withdrawal_Status}\\nFee : {Withdrawal_Fee}／{Withdrawal_Fee_Currency}`,
        ja: `{Withdrawal_Quantity} {Withdrawal_Currency}の出金 {Withdrawal_Status}になりました。\\n手数料 : {Withdrawal_Fee}／{Withdrawal_Fee_Currency}`,
      })})`,
    )
    await queryRunner.query(
      `INSERT INTO system_push_notification_setting (type, title, content) VALUES ("${
        ESystemPushNotificationType.WITHDRAW_REJECTED
      }", ${dbJsonText({
        en: 'Withdrawal notification',
        ja: '出金のお知らせ',
      })}, ${dbJsonText({
        en: `Withdraw {Withdrawal_Quantity} {Withdrawal_Currency} has been {Withdrawal_Status}`,
        ja: `{Withdrawal_Quantity} {Withdrawal_Currency}の出金 {Withdrawal_Status}になりました。`,
      })})`,
    )
    await queryRunner.query(
      `INSERT INTO system_push_notification_setting (type, title, content) VALUES ("${
        ESystemPushNotificationType.ORDER_COMPLETED
      }", ${dbJsonText({
        en: 'Order notification',
        ja: '約定のお知らせ',
      })}, ${dbJsonText({
        en: `Order completed.\\nPair : {ExOrder_Pair}\\nType : {ExOrder_Type}\\nSide : {ExOrder_Side}\\nStatus : {ExOrder_Status}`,
        ja: `約定成功しました。\\n注文通貨ペア : {ExOrder_Pair}\\nタイプ : {ExOrder_Type}\\n注文方向 : {ExOrder_Side}\\nステータス : {ExOrder_Status}`,
      })})`,
    )
    await queryRunner.query(
      `INSERT INTO system_push_notification_setting (type, title, content) VALUES ("${
        ESystemPushNotificationType.OPEN_STOP_LIMIT_ORDER
      }", ${dbJsonText({
        en: 'Limit order open notification',
        ja: 'ストップ価格に満たのお知らせ',
      })}, ${dbJsonText({
        en: `Limit order condition has been matched. Order is now opened.\\nPair : {ExOrder_Pair}\\nType : {ExOrder_Type}\\nSide : {ExOrder_Side}`,
        ja: `ストップ価格に満たしました。\\n注文通貨ペア : {ExOrder_Pair}\\nタイプ : {ExOrder_Type}\\n注文方向 : {ExOrder_Side}`,
      })})`,
    )
    await queryRunner.query(
      `INSERT INTO system_push_notification_setting (type, title, content) VALUES ("${
        ESystemPushNotificationType.DIVIDEND
      }", ${dbJsonText({
        en: 'Dividend notification',
        ja: '配当付与のお知らせ',
      })}, ${dbJsonText({
        en: '{Dividend_Amount} {Dividend_Currency} was granted.',
        ja: '{Dividend_Amount} {Dividend_Currency}付与されました。 ',
      })})`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
