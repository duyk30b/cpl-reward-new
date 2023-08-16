import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm'

export class createUserScreenTable1654247811813 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'admin_screen',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'user_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'screen_id',
            type: 'int',
            isNullable: false,
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
      'admin_screen',
      new TableIndex({
        name: 'INDEX_USER_ID',
        columnNames: ['user_id'],
      }),
    )
    await queryRunner.createIndex(
      'admin_screen',
      new TableIndex({
        name: 'INDEX_SCREEN_ID',
        columnNames: ['screen_id'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('admin_screen')
    await queryRunner.dropIndex('admin_screen', 'INDEX_USER_ID')
    await queryRunner.dropIndex('admin_screen', 'INDEX_SCREEN_ID')
    await queryRunner.dropTable('admin_screen', true)
  }
}
