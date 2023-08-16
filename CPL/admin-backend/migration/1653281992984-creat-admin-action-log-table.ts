import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class creatAdminActionLogTable1653281992984
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'admin_action_log',
        columns: [
          {
            name: 'id',
            type: 'bigInt',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'admin_id',
            type: 'bigInt',
            isNullable: false,
          },
          {
            name: 'location',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'ip',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'user_agent',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'endpoint',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'method',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'request',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'response',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'status_code',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'time_processed',
            type: 'int',
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
        ],
      }),
      true,
    )

    await queryRunner.createIndex(
      'admin_action_log',
      new TableIndex({
        name: 'INDEX_ADMIN_ID',
        columnNames: ['admin_id'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('admin_action_log', true)
  }
}
