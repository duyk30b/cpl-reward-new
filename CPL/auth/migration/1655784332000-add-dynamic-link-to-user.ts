import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addDynamicLinkToUser1655784332000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'dynamic_link',
        type: 'varchar',
        isNullable: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'dynamic_link')
  }
}
