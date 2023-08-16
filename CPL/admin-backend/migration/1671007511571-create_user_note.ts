import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class createUserNote1671007511571 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_note',
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
            name: 'admin_id',
            type: 'bigInt',
          },
          {
            name: 'note',
            type: 'text',
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
      'user_note',
      new TableIndex({
        name: 'INDEX_USER_NOTE_USER_ID',
        columnNames: ['user_id'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('user_note', 'INDEX_USER_NOTE_USER_ID')
    await queryRunner.dropTable('user_note', true)
  }
}
