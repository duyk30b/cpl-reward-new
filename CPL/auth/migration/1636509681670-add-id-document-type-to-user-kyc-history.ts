import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addIdDocumentTypeToUserKycHistory1636509681670
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user_kyc_history',
      new TableColumn({
        name: 'id_document_type',
        type: 'int',
        default: 1,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user_kyc_history', 'id_document_type')
  }
}
