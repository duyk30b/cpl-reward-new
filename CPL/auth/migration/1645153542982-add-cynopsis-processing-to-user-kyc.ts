import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addCynopsisProcessingToUserKyc1645153542982
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user_kyc',
      new TableColumn({
        name: 'cynopsis_processing',
        type: 'boolean',
        default: false,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user_kyc', 'cynopsis_processing')
  }
}
