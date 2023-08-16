import { MigrationInterface, QueryRunner } from 'typeorm'

export class modifyFundInEnterpriseInfo1647936436605
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE enterprise_info MODIFY COLUMN sources_funding VARCHAR(255)`,
    )
    await queryRunner.query(
      `ALTER TABLE enterprise_info_history MODIFY COLUMN sources_funding VARCHAR(255)`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(
    //   `ALTER TABLE enterprise_info MODIFY COLUMN sources_funding BIGINT(20)`,
    // )
    // await queryRunner.query(
    //   `ALTER TABLE enterprise_info_history MODIFY COLUMN sources_funding BIGINT(20)`,
    // )
  }
}
