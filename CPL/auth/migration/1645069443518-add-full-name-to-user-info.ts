import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addFullNameToUserInfo1645069443518 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user_info',
      new TableColumn({
        name: 'full_name',
        type: 'varchar',
        isNullable: true,
      }),
    )

    await queryRunner.addColumn(
      'user_info_history',
      new TableColumn({
        name: 'full_name',
        type: 'varchar',
        isNullable: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user_info', 'full_name')
    await queryRunner.dropColumn('user_info_history', 'full_name')
  }
}
