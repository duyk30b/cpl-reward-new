import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class createUserKycAdminDecisionTable1636080136849
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_kyc_admin_decision',
        columns: [
          {
            name: 'id',
            type: 'bigInt',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'history_id',
            type: 'bigInt',
          },
          {
            name: 'status',
            type: 'int',
            default: 5,
          },
          {
            name: 'risk_rating',
            type: 'int',
            comment: '1 LOW, 2 MEDIUM, 3 HIGH, 4 UNKNOWN, 5 FAIL_INFORMATION',
          },
          // {
          //   name: 'user_id',
          //   type: 'bigInt',
          // },
          {
            name: 'compare_document_type',
            type: 'boolean',
            default: false,
          },
          {
            name: 'compare_liveness_selfie',
            type: 'boolean',
            default: false,
          },
          {
            name: 'compare_birthday',
            type: 'boolean',
            default: false,
          },
          {
            name: 'compare_name',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_at',
            type: 'bigInt',
            isNullable: true,
          },
          {
            name: 'updated_at',
            type: 'bigInt',
            isNullable: true,
          },
        ],
      }),
      true,
    )
    await queryRunner.createIndex(
      'user_kyc_admin_decision',
      new TableIndex({
        name: 'INDEX_HISTORY_ID',
        columnNames: ['history_id'],
        isUnique: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('user_kyc_admin_decision', 'INDEX_HISTORY_ID')
    await queryRunner.dropTable('user_kyc_admin_decision', true)
  }
}
