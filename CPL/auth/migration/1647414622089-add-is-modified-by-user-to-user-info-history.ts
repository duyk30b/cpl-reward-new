import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addIsModifiedByUserToUserInfoHistory1647414622089
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user_info_history',
      new TableColumn({
        name: 'is_modified_by_user',
        type: 'boolean',
        default: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user_info_history', 'is_modified_by_user')
  }
}
