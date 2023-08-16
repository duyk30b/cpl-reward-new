import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class createUserReadGlobalNotification1643274924721
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_read_global_notification',
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
            name: 'global_notifictaion_id',
            type: 'bigInt',
          },
          {
            name: 'created_at',
            type: 'bigInt',
          },
        ],
      }),
    )
    await queryRunner.createIndex(
      'user_read_global_notification',
      new TableIndex({
        name: 'INDEX_USER_GLOBAL_NOTIFICATION',
        columnNames: ['user_id', 'global_notifictaion_id'],
        isUnique: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_read_global_notification', true, true)
  }
}
