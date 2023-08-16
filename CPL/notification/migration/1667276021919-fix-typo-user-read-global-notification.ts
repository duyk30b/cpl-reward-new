import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex,
} from 'typeorm'

export class fixTypoUserReadGlobalNotification1667276021919
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'user_read_global_notification',
      'INDEX_USER_GLOBAL_NOTIFICATION',
    )

    await queryRunner.dropColumn(
      'user_read_global_notification',
      'global_notifictaion_id',
    )

    await queryRunner.addColumn(
      'user_read_global_notification',
      new TableColumn({
        name: 'global_notification_id',
        type: 'bigInt',
      }),
    )

    await queryRunner.createIndex(
      'user_read_global_notification',
      new TableIndex({
        name: 'INDEX_USER_READ_GLOBAL_NOTIFICATION',
        columnNames: ['user_id', 'global_notification_id'],
        isUnique: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex(
      'user_read_global_notification',
      new TableIndex({
        name: 'INDEX_USER_GLOBAL_NOTIFICATION',
        columnNames: ['user_id', 'global_notifictaion_id'],
        isUnique: true,
      }),
    )

    await queryRunner.addColumn(
      'user_read_global_notification',
      new TableColumn({
        name: 'global_notifictaion_id',
        type: 'bigInt',
      }),
    )

    await queryRunner.dropColumn(
      'user_read_global_notification',
      'global_notification_id',
    )

    await queryRunner.dropIndex(
      'user_read_global_notification',
      'INDEX_USER_READ_GLOBAL_NOTIFICATION',
    )
  }
}
