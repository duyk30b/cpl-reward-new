import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addIdDocumentNoToUserKyc1637737689278
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user_kyc',
      new TableColumn({
        name: 'id_document_no',
        type: 'varchar',
        isNullable: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user_kyc', 'id_document_no')
  }
}
