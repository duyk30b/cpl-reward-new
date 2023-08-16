import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addIdDocumentTypeToUserKyc1636509674991
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user_kyc',
      new TableColumn({
        name: 'id_document_type',
        type: 'int',
        default: 1,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user_kyc', 'id_document_type')
  }
}
