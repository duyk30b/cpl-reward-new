import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class alterBanUserHistoriesTable1656490131389
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'ban_user_histories',
      new TableColumn({
        name: 'external_response',
        type: 'longtext',
        isNullable: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('ban_user_histories', 'external_response')
  }
}
