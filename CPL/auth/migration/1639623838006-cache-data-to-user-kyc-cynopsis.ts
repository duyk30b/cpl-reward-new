import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class cacheDataToUserKycCynopsis1639623838006
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'user_kyc_cynopsis',
      'risk_report',
      new TableColumn({
        name: 'cynopsis_data',
        type: 'longtext',
        isNullable: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'user_kyc_cynopsis',
      'cynopsis_data',
      new TableColumn({
        name: 'risk_report',
        type: 'text',
        isNullable: true,
      }),
    )
  }
}
