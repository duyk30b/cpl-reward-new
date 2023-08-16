import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class createGlobalNotification1643193214115
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'global_notification',
        columns: [
          {
            name: 'id',
            type: 'bigInt',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'message',
            type: 'longtext',
            comment: 'JSON of message',
          },
          {
            name: 'notification_category_id',
            type: 'int',
          },
          {
            name: 'source_service',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'bigInt',
          },
        ],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('global_notification', true, true)
  }
}
