import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class alterBalanceImportExcelFilesTable1670404183135
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('balance_import_excel_files', [
      new TableColumn({
        name: 'balance_type',
        type: 'varchar',
        scale: 50,
        default: '"EXCHANGE"',
      }),
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('balance_import_excel_files', [
      new TableColumn({
        name: 'balance_type',
        type: 'varchar',
        scale: 50,
        default: '"EXCHANGE"',
      }),
    ])
  }
}
