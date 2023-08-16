import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm'

export class createUserInfoTable1636015049777 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_info',
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
            name: 'first_name',
            type: 'varchar',
          },
          {
            name: 'last_name',
            type: 'varchar',
          },
          {
            name: 'furigana_1',
            type: 'varchar',
            isNullable: true,
            comment: 'Required if nationality is Japan',
          },
          {
            name: 'furigana_2',
            type: 'varchar',
            isNullable: true,
            comment: 'Required if nationality is Japan',
          },
          {
            name: 'birthday',
            type: 'date',
          },
          {
            name: 'phone',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'building_room',
            type: 'varchar',
            isNullable: true,
            comment: 'Building/Room',
          },
          {
            name: 'address',
            type: 'varchar',
          },
          {
            name: 'city',
            type: 'varchar',
          },
          {
            name: 'state_region',
            type: 'varchar',
            comment: 'State/Region',
          },
          {
            name: 'zip_code',
            type: 'varchar',
          },
          {
            name: 'country_id',
            type: 'int',
          },
          {
            name: 'nationality_id',
            type: 'int',
          },
          {
            name: 'gender',
            type: 'int',
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
      'user_info',
      new TableIndex({
        name: 'INDEX_USER_ID',
        columnNames: ['user_id'],
        isUnique: true,
      }),
    )
    await queryRunner.createForeignKey(
      'user_info',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('user_info')
    await queryRunner.dropForeignKeys('user_info', table.foreignKeys)
    await queryRunner.dropIndex('user_info', 'INDEX_USER_ID')
    await queryRunner.dropTable('user_info', true)
  }
}
