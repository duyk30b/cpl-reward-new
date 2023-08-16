import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class createPushCommand1667891949979 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'push_schedule',
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
      'push_schedule',
      new TableIndex({
        name: 'INDEX_PUSH_SCHEDULE_GLOBAL_NOTIFICATION',
        columnNames: ['global_notification_id'],
      }),
    )

    await queryRunner.createIndex(
      'push_schedule',
      new TableIndex({
        name: 'INDEX_PUSH_SCHEDULE_PUBLISH_AT',
        columnNames: ['publish_at'],
      }),
    )

    await queryRunner.createIndex(
      'push_schedule',
      new TableIndex({
        name: 'INDEX_PUSH_SCHEDULE_STATUS',
        columnNames: ['status'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'push_schedule',
      'INDEX_PUSH_SCHEDULE_GLOBAL_NOTIFICATION',
    )
    await queryRunner.dropIndex(
      'push_schedule',
      'INDEX_PUSH_SCHEDULE_PUBLISH_AT',
    )
    await queryRunner.dropIndex('push_schedule', 'INDEX_PUSH_SCHEDULE_STATUS')
    await queryRunner.dropTable('push_schedule', true)
  }
}
