import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm'

export class addIndexUserIdToUserKyc1645089923703
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex(
      'user_kyc',
      new TableIndex({
        name: 'INDEX_USER_ID',
        columnNames: ['user_id'],
        isUnique: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('user_kyc', 'INDEX_USER_ID')
  }
}
