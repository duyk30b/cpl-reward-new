import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addRemarkToUserKyc1639019874782 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user_kyc',
      new TableColumn({
        name: 'remark',
        type: 'varchar',
        isNullable: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user_kyc', 'remark')
  }
}
