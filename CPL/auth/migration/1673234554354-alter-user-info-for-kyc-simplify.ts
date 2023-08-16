/* eslint-disable @typescript-eslint/no-unused-vars */
import { MigrationInterface, QueryRunner } from 'typeorm'

export class alterUserInfoForKycSimplify1673234554354
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE user_info MODIFY COLUMN address VARCHAR(255) NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE user_info MODIFY COLUMN city VARCHAR(255) NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE user_info MODIFY COLUMN state_region VARCHAR(255) NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE user_info MODIFY COLUMN zip_code VARCHAR(255) NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE user_info MODIFY COLUMN country_id VARCHAR(255) NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE user_info MODIFY COLUMN phone_country VARCHAR(255) NULL`,
    )

    await queryRunner.query(
      `ALTER TABLE user_info_history MODIFY COLUMN address VARCHAR(255) NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE user_info_history MODIFY COLUMN city VARCHAR(255) NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE user_info_history MODIFY COLUMN state_region VARCHAR(255) NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE user_info_history MODIFY COLUMN zip_code VARCHAR(255) NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE user_info_history MODIFY COLUMN country_id VARCHAR(255) NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE user_info_history MODIFY COLUMN phone_country VARCHAR(255) NULL`,
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
