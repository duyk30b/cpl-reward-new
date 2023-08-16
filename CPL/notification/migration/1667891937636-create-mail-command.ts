import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class createMailCommand1667891937636 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'mail_schedule',
        columns: [
          {
            name: 'id',
            type: 'bigInt',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'global_notification_id',
            type: 'bigInt',
            isNullable: true,
          },
          {
            name: 'title',
            type: 'longtext',
          },
          {
            name: 'content',
            type: 'longtext',
          },
          {
            name: 'created_at',
            type: 'bigInt',
          },
          {
            name: 'publish_at',
            type: 'bigInt',
          },
          {
            name: 'sent_at',
            type: 'bigInt',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'int',
            default: 2,
          },
          {
            name: 'user_groups',
            type: 'text',
            default: '"[]"',
          },
        ],
      }),
      true,
    )

    await queryRunner.createIndex(
      'mail_schedule',
      new TableIndex({
        name: 'INDEX_MAIL_SCHEDULE_GLOBAL_NOTIFICATION',
        columnNames: ['global_notification_id'],
      }),
    )

    await queryRunner.createIndex(
      'mail_schedule',
      new TableIndex({
        name: 'INDEX_MAIL_SCHEDULE_PUBLISH_AT',
        columnNames: ['publish_at'],
      }),
    )

    await queryRunner.createIndex(
      'mail_schedule',
      new TableIndex({
        name: 'INDEX_MAIL_SCHEDULE_STATUS',
        columnNames: ['status'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'mail_schedule',
      'INDEX_MAIL_SCHEDULE_GLOBAL_NOTIFICATION',
    )
    await queryRunner.dropIndex(
      'mail_schedule',
      'INDEX_MAIL_SCHEDULE_PUBLISH_AT',
    )
    await queryRunner.dropIndex('mail_schedule', 'INDEX_MAIL_SCHEDULE_STATUS')
    await queryRunner.dropTable('mail_schedule', true)
  }
}
