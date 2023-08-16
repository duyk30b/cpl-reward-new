import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class createSumsubInfoHistory1661503086532
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sumsub_info_history',
        columns: [
          {
            name: 'id',
            type: 'bigInt',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'user_id',
            type: 'bigInt',
          },
          {
            name: 'user_kyc_history_id',
            type: 'bigInt',
          },
          {
            name: 'review_answer',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'review_reject_type',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'compare_status',
            type: 'int',
            default: 3,
          },
          {
            name: 'liveness_status',
            type: 'int',
            default: 5,
          },
          {
            name: 'identity_document_verification_status',
            type: 'int',
            default: 3,
          },
          {
            name: 'created_at',
            type: 'bigInt',
            isNullable: true,
          },
        ],
      }),
      true,
    )

    await queryRunner.createIndex(
      'sumsub_info_history',
      new TableIndex({
        name: 'INDEX_USER_ID',
        columnNames: ['user_id'],
      }),
    )

    await queryRunner.createIndex(
      'sumsub_info_history',
      new TableIndex({
        name: 'INDEX_KYC_HISTORY_ID',
        columnNames: ['user_kyc_history_id'],
        isUnique: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('sumsub_info_history', 'INDEX_USER_ID')
    await queryRunner.dropIndex('sumsub_info_history', 'INDEX_KYC_HISTORY_ID')
    await queryRunner.dropTable('sumsub_info_history', true)
  }
}
