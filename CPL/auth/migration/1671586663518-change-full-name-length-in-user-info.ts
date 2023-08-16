/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { MigrationInterface, QueryRunner } from 'typeorm'

export class changeFullNameLengthInUserInfo1671586663518
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE user_info MODIFY COLUMN full_name VARCHAR(600)`,
    )
    await queryRunner.query(
      `ALTER TABLE user_info_history MODIFY COLUMN full_name VARCHAR(600)`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
