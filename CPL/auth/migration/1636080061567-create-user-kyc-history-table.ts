import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class createUserKycHistoryTable1636080061567
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_kyc_history',
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
            name: 'user_info_history_id',
            type: 'bigInt',
          },
          {
            name: 'type',
            type: 'int',
            comment: 'Type of KYC',
          },
          {
            name: 'provider',
            type: 'int',
            default: 1,
            comment: '3rd KYC provider',
          },
          {
            name: 'files',
            type: 'text',
            comment: 'JSON KYC files',
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_kyc_history', true)
  }
}
