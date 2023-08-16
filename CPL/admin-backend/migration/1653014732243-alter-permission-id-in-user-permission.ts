/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { MigrationInterface, QueryRunner } from 'typeorm'

export class alterPermissionIdInUserPermission1653014732243
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE user_permission MODIFY COLUMN permission_id INT(11)`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
