import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class createReasonTable1677468650444 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'reason',
        columns: [
          {
            name: 'id',
            type: 'bigInt',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'longText',
          },
          {
            name: 'category_id',
            type: 'bigInt',
          },
          {
            name: 'created_at',
            type: 'bigInt',
            isNullable: true,
          },
          {
            name: 'updated_at',
            type: 'bigInt',
            isNullable: true,
          },
        ],
      }),
      true,
    )

    await queryRunner.createIndex(
      'reason',
      new TableIndex({
        name: 'INDEX_CATEGORY_ID',
        columnNames: ['category_id'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('reason', 'INDEX_CATEGORY_ID')
    await queryRunner.dropTable('reason', true)
  }
}
