import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addImageToGlobalNotification1667287557516
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'global_notification',
      new TableColumn({
        name: 'image',
        type: 'varchar',
        length: '500',
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('global_notification', 'image')
  }
}
