import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class createPersonalNotification1643191118178
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'personal_notification',
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
            name: 'user_id',
            type: 'bigInt',
          },
          {
            name: 'source_service',
            type: 'varchar',
          },
          {
            name: 'status',
            type: 'int',
            default: 2,
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
    await queryRunner.dropTable('personal_notification', true, true)
  }
}
