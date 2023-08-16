import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class modifyStatusInPersonalNotification1667458875827
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('personal_notification', 'status')
    await queryRunner.addColumn(
      'personal_notification',
      new TableColumn({
        name: 'is_read',
        type: 'boolean',
        default: 0,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'personal_notification',
      new TableColumn({
        name: 'status',
        type: 'int',
        default: 2,
      }),
    )
    await queryRunner.dropColumn('personal_notification', 'is_read')
  }
}
