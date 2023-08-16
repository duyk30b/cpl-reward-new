import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class createLoginHistoryTable1644921260898
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'login_history',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isGenerated: true,
            generationStrategy: 'increment',
            isPrimary: true,
          },
          {
            name: 'user_id',
            type: 'bigint',
          },
          {
            name: 'device_id',
            type: 'bigint',
          },
          {
            name: 'browser',
            type: 'varchar',
          },
          {
            name: 'os',
            type: 'varchar',
          },
          {
            name: 'ip',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'bigint',
          },
        ],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('login_history')
  }
}
