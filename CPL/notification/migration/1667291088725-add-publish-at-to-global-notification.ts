import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex,
} from 'typeorm'

export class addPublishAtToGlobalNotification1667291088725
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'global_notification',
      new TableColumn({
        name: 'publish_at',
        type: 'bigInt',
      }),
    )

    await queryRunner.createIndex(
      'global_notification',
      new TableIndex({
        name: 'INDEX_GLOBAL_NOTIFICATION_PUBLISH_AT',
        columnNames: ['publish_at'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('global_notification', 'publish_at')
    await queryRunner.dropIndex(
      'global_notification',
      'INDEX_GLOBAL_NOTIFICATION_PUBLISH_AT',
    )
  }
}
