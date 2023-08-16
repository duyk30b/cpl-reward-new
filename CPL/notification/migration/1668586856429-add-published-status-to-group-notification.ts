import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addPublishedStatusToGroupNotification1668586856429
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'group_notification',
      new TableColumn({
        name: 'is_published',
        type: 'boolean',
        default: false,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('group_notification', 'is_published')
  }
}
