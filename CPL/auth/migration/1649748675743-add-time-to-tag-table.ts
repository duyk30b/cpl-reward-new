import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addTimeToTagTable1649748675743 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'tag',
      new TableColumn({
        name: 'created_at',
        type: 'bigInt',
        isNullable: true,
      }),
    )

    await queryRunner.addColumn(
      'tag',
      new TableColumn({
        name: 'updated_at',
        type: 'bigInt',
        isNullable: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('tag', 'created_at')
    await queryRunner.dropColumn('tag', 'updated_at')
  }
}
