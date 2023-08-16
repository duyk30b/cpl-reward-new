import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm'

export class addTimeIndexsToNotification1667371190997
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex(
      'personal_notification',
      new TableIndex({
        name: 'INDEX_PERSONAL_NOTIFICATION_CREATED_AT',
        columnNames: ['created_at'],
      }),
    )

    await queryRunner.createIndex(
      'personal_notification',
      new TableIndex({
        name: 'INDEX_PERSONAL_NOTIFICATION_USER_ID',
        columnNames: ['user_id'],
      }),
    )

    await queryRunner.createIndex(
      'personal_notification',
      new TableIndex({
        name: 'INDEX_PERSONAL_NOTIFICATION_CATEGORY_ID',
        columnNames: ['notification_category_id'],
      }),
    )

    await queryRunner.createIndex(
      'global_notification',
      new TableIndex({
        name: 'INDEX_GLOBAL_NOTIFICATION_CATEGORY_ID',
        columnNames: ['notification_category_id'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'personal_notification',
      'INDEX_PERSONAL_NOTIFICATION_CREATED_AT',
    )
    await queryRunner.dropIndex(
      'personal_notification',
      'INDEX_PERSONAL_NOTIFICATION_USER_ID',
    )
    await queryRunner.dropIndex(
      'personal_notification',
      'INDEX_PERSONAL_NOTIFICATION_CATEGORY_ID',
    )
    await queryRunner.dropIndex(
      'global_notification',
      'INDEX_GLOBAL_NOTIFICATION_CATEGORY_ID',
    )
  }
}
