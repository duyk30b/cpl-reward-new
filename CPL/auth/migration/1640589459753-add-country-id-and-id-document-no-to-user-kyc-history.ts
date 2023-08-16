import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addCountryIdAndIdDocumentNoToUserKycHistory1640589459753
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('user_kyc_history', [
      new TableColumn({
        name: 'country_id',
        type: 'int',
        isNullable: true,
      }),
      new TableColumn({
        name: 'id_document_no',
        type: 'varchar',
        isNullable: true,
      }),
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('user_kyc_history', [
      'country_id',
      'id_document_no',
    ])
  }
}
