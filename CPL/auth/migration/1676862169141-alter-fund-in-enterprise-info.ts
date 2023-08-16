/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { MigrationInterface, QueryRunner } from 'typeorm'

export class alterFundInEnterpriseInfo1676862169141
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE enterprise_info MODIFY COLUMN funding_currency VARCHAR(255) NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE enterprise_info_history MODIFY COLUMN funding_currency VARCHAR(255) NULL`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
