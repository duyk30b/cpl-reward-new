import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm'

export class createBlacklistUser1632990407486 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'blacklist_user',
        columns: [
          {
            name: 'id',
            type: 'bigInt',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'user_id',
            type: 'bigInt',
          },
          {
            name: 'note',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'until',
            type: 'bigInt',
            isNullable: false,
            default: 0,
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
      'blacklist_user',
      new TableIndex({
        name: 'INDEX_USER_ID',
        columnNames: ['user_id'],
      }),
    )
    await queryRunner.createForeignKey(
      'blacklist_user',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('blacklist_user')
    await queryRunner.dropForeignKeys('blacklist_user', table.foreignKeys)
    await queryRunner.dropIndex('blacklist_user', 'INDEX_USER_ID')
    await queryRunner.dropTable('blacklist_user', true)
  }
}
