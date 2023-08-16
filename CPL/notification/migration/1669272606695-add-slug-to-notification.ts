import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addSlugToNotification1669272606695 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'group_notification',
      new TableColumn({
        name: 'slug',
        type: 'varchar',
        length: '255',
      }),
    )

    await queryRunner.addColumn(
      'personal_notification',
      new TableColumn({
        name: 'slug',
        type: 'varchar',
        length: '255',
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('group_notification', 'slug')
    await queryRunner.dropColumn('personal_notification', 'slug')
  }
}
