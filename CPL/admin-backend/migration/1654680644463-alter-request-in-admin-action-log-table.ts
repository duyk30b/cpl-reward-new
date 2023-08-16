/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { MigrationInterface, QueryRunner } from 'typeorm'

export class alterRequestInAdminActionLogTable1654680644463
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE admin_action_log MODIFY COLUMN request LONGTEXT`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
