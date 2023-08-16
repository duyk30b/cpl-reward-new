import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class modifyNotificationForV31667275023409
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('personal_notification', [
      'message',
      'source_service',
    ])

    await queryRunner.addColumns('personal_notification', [
      new TableColumn({
        name: 'title',
        type: 'longtext',
      }),
      new TableColumn({
        name: 'content',
        type: 'longtext',
      }),
    ])

    await queryRunner.dropColumns('global_notification', [
      'message',
      'source_service',
    ])

    await queryRunner.addColumns('global_notification', [
      new TableColumn({
        name: 'title',
        type: 'longtext',
      }),
      new TableColumn({
        name: 'content',
        type: 'longtext',
      }),
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('personal_notification', [
      new TableColumn({
        name: 'message',
        type: 'text',
      }),
      new TableColumn({
        name: 'source_service',
        type: 'varchar',
      }),
    ])

    await queryRunner.dropColumns('personal_notification', ['title', 'content'])

    await queryRunner.addColumns('global_notification', [
      new TableColumn({
        name: 'message',
        type: 'text',
      }),
      new TableColumn({
        name: 'source_service',
        type: 'varchar',
      }),
    ])

    await queryRunner.dropColumns('global_notification', ['title', 'content'])
  }
}
