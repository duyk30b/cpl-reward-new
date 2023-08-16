import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addCountryIdToUserKyc1640589430971 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user_kyc',
      new TableColumn({
        name: 'country_id',
        type: 'int',
        isNullable: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user_kyc', 'country_id')
  }
}
