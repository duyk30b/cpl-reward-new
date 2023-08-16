/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { MigrationInterface, QueryRunner } from 'typeorm'

export class alterPermissionIdInRolePermission1653014746678
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE role_permission MODIFY COLUMN permission_id INT(11)`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
