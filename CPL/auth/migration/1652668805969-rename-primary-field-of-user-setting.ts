import { MigrationInterface, QueryRunner } from 'typeorm'

export class renamePrimaryFieldOfUserSetting1652668805969
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn('user_setting', 'user_id', 'id')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn('user_setting', 'id', 'user_id')
  }
}
