import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class createBanUserHistoryTable1655278631607
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'ban_user_histories',
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
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'int',
            default: 1,
          },
          {
            name: 'admin_id',
            type: 'bigInt',
            isNullable: false,
          },
          {
            name: 'admin_action_id',
            type: 'bigInt',
            isNullable: false,
          },
          {
            name: 'request_time',
            type: 'bigInt',
            isNullable: true,
          },
          {
            name: 'ban_time',
            type: 'bigInt',
            isNullable: true,
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
          {
            name: 'note',
            type: 'text',
            isNullable: true,
          },
        ],
      }),
      true,
    )

    await queryRunner.createIndex(
      'ban_user_histories',
      new TableIndex({
        name: 'IDX_USER_ID_ADMIN_ACTION_ID',
        columnNames: ['user_id', 'admin_action_id'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('ban_user_histories', true)
  }
}
