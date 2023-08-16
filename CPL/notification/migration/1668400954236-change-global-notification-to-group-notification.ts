import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex,
} from 'typeorm'

export class changeGlobalNotificationToGroupNotification1668400954236
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable('global_notification', 'group_notification')

    await queryRunner.addColumns('group_notification', [
      new TableColumn({
        name: 'is_global',
        type: 'boolean',
        default: true,
      }),
      new TableColumn({
        name: 'user_groups',
        type: 'text',
        default: '"[]"',
      }),
    ])

    await queryRunner.createIndex(
      'group_notification',
      new TableIndex({
        name: 'INDEX_GROUP_NOTIFICATION_IS_GLOBAL',
        columnNames: ['is_global'],
      }),
    )

    await queryRunner.query(
      `ALTER TABLE user_read_global_notification CHANGE global_notification_id group_notification_id BIGINT(20)`,
    )

    await queryRunner.query(
      `ALTER TABLE mail_schedule CHANGE global_notification_id group_notification_id BIGINT(20)`,
    )

    await queryRunner.query(
      `ALTER TABLE push_schedule CHANGE global_notification_id group_notification_id BIGINT(20)`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable('group_notification', 'global_notification')

    await queryRunner.dropIndex(
      'global_notification',
      'INDEX_GROUP_NOTIFICATION_IS_GLOBAL',
    )

    await queryRunner.dropColumns('global_notification', [
      'is_global',
      'user_groups',
    ])

    await queryRunner.query(
      `ALTER TABLE user_read_global_notification CHANGE group_notification_id global_notification_id BIGINT(20)`,
    )

    await queryRunner.query(
      `ALTER TABLE mail_schedule CHANGE group_notification_id global_notification_id BIGINT(20)`,
    )

    await queryRunner.query(
      `ALTER TABLE push_schedule CHANGE group_notification_id global_notification_id BIGINT(20)`,
    )
  }
}
