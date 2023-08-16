import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class createBalanceImportExcelSettings1662447595597
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'balance_import_excel_settings',
        columns: [
          {
            name: 'id',
            type: 'bigInt',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'currency',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'max_line_amount',
            type: 'varchar',
            isNullable: false,
            default: '0',
          },
          {
            name: 'max_file_amount',
            type: 'varchar',
            isNullable: false,
            default: '0',
          },
          {
            name: 'remain_amount',
            type: 'varchar',
            isNullable: false,
            default: '0',
          },
          {
            name: 'is_unlimited',
            type: 'tinyInt',
            isNullable: false,
            default: '0',
          },
          {
            name: 'created_at',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'updated_at',
            type: 'varchar',
            isNullable: true,
          },
        ],
      }),
      true,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('balance_import_excel_settings', true)
  }
}
