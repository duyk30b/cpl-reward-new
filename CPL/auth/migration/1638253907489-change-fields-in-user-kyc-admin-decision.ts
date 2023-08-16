import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class changeFieldsInUserKycAdminDecision1638253907489
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn(
      'user_kyc_admin_decision',
      'history_id',
      'user_kyc_history_id',
    )

    await queryRunner.addColumn(
      'user_kyc_admin_decision',
      new TableColumn({
        name: 'user_id',
        type: 'bigInt',
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn(
      'user_kyc_admin_decision',
      'user_kyc_history_id',
      'history_id',
    )
    await queryRunner.dropColumn('user_kyc_admin_decision', 'user_id')
  }
}
