import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addEnterpriseInfoHistoryToUserKycHistory1640229227498
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user_kyc_history',
      new TableColumn({
        name: 'enterprise_info_history_id',
        type: 'bigInt',
        isNullable: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(
      'user_kyc_history',
      'enterprise_info_history_id',
    )
  }
}
