import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addDynamicLinkToChannel1655784332000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'channel',
      new TableColumn({
        name: 'dynamic_link',
        type: 'varchar',
        isNullable: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('channel', 'dynamic_link')
  }
}
