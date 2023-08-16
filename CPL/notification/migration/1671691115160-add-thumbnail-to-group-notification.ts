import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addThumbnailToGroupNotification1671691115160
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'group_notification',
      new TableColumn({
        name: 'thumbnail',
        type: 'varchar',
        isNullable: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('group_notification', 'thumbnail')
  }
}
