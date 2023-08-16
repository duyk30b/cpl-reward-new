import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm'

export class createRoleScreenTable1654247811813 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'role_screen',
        columns: [
          {
            name: 'id',
            type: 'bigInt',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'role_id',
            type: 'bigInt',
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
      'role_screen',
      new TableIndex({
        name: 'INDEX_ROLE_ID',
        columnNames: ['role_id'],
      }),
    )
    await queryRunner.createIndex(
      'role_screen',
      new TableIndex({
        name: 'INDEX_SCREEN_ID',
        columnNames: ['screen_id'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('role_screen')
    await queryRunner.dropIndex('role_screen', 'INDEX_ROLE_ID')
    await queryRunner.dropIndex('role_screen', 'INDEX_SCREEN_ID')
    await queryRunner.dropTable('role_screen', true)
  }
}
