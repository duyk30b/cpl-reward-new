import { MigrationInterface, QueryRunner } from 'typeorm'

export class changeFieldInUserKyc1638253977702 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn(
      'user_kyc',
      'history_id',
      'user_kyc_history_id',
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn(
      'user_kyc',
      'user_kyc_history_id',
      'history_id',
    )
  }
}
