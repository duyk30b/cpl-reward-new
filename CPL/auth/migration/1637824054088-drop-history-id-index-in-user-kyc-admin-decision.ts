import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm'

export class dropHistoryIdIndexInUserKycAdminDecision1637824054088
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('user_kyc_admin_decision', 'INDEX_HISTORY_ID')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex(
      'user_kyc_admin_decision',
      new TableIndex({
        name: 'INDEX_HISTORY_ID',
        columnNames: ['history_id'],
        isUnique: true,
      }),
    )
  }
}
