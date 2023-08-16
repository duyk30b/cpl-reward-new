/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { MigrationInterface, QueryRunner } from 'typeorm'
import { dbJsonText } from '../libs/common/src/helpers/seed.helper'

export class kycPushNotiSeeder1657268644226 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM system_push_notification_setting where type = "kyc_completed"`,
    )

    await queryRunner.query(
      `INSERT INTO system_push_notification_setting (type, title, content) VALUES ("kyc_accepted", ${dbJsonText(
        {
          en: 'KYC verification process is now completed',
          ja: '本人確認書類審査完了のお知らせ',
        },
      )}, ${dbJsonText({
        en: 'Your submited KYC information has been Approved.',
        ja: 'KYCの申請が承認済みされました。',
      })})`,
    )

    await queryRunner.query(
      `INSERT INTO system_push_notification_setting (type, title, content) VALUES ("kyc_rejected", ${dbJsonText(
        {
          en: 'KYC verification process is now completed',
          ja: '本人確認書類審査完了のお知らせ',
        },
      )}, ${dbJsonText({
        en: 'Your submited KYC information has been Rejected.',
        ja: 'KYCの申請が非承認されました。',
      })})`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
