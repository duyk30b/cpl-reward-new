import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class createUserKycTable1636080052691 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_kyc',
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
            name: 'history_id',
            type: 'bigInt',
          },
          {
            name: 'status',
            default: 5,
            type: 'int',
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
    await queryRunner.createIndex(
      'user_kyc',
      new TableIndex({
        name: 'INDEX_HISTORY_ID',
        columnNames: ['history_id'],
        isUnique: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('user_kyc', 'INDEX_HISTORY_ID')
    await queryRunner.dropTable('user_kyc', true)
  }
}
