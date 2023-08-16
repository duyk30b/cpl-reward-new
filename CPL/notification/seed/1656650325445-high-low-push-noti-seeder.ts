/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ESystemPushNotificationType } from '../libs/system-push-notification-setting/src/system-push-notification-setting.enum'
import { MigrationInterface, QueryRunner } from 'typeorm'
import { dbJsonText } from '../libs/common/src/helpers/seed.helper'

export class highLowPushNotiSeeder1656650325445 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO system_push_notification_setting (type, title, content) VALUES ("${
        ESystemPushNotificationType.HIGH_LOW_COMPLETE
      }", ${dbJsonText({
        en: 'Order result notification',
        ja: '注文結果のお知らせ',
      })}, ${dbJsonText({
        en: 'Order {Mode}, {TimeFrame}, {Pair} has been {Status}.',
        ja: 'こちらの注文 {Mode}、{TimeFrame}、{Pair}は{Status}になりました。',
      })})`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
