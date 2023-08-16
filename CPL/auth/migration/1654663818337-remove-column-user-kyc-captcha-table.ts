import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class removeColumnUserKycCaptchaTable1654663818337
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (
      await queryRunner.hasColumn('user_kyc_captcha', 'user_info_history_id')
    ) {
      await queryRunner.dropColumn('user_kyc_captcha', 'user_info_history_id')
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (
      !(await queryRunner.hasColumn('user_kyc_captcha', 'user_info_history_id'))
    ) {
      await queryRunner.addColumn(
        'user_kyc_captcha',
        new TableColumn({
          name: 'user_info_history_id',
          type: 'bigInt',
        }),
      )
    }
  }
}
