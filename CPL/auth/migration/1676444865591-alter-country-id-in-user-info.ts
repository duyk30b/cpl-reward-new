/* eslint-disable @typescript-eslint/no-empty-function */
import { MigrationInterface, QueryRunner } from 'typeorm'

export class alterCountryIdInUserInfo1676444865591
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE user_info MODIFY COLUMN country_id INT(11) NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE user_info_history MODIFY COLUMN country_id INT(11) NULL`,
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
