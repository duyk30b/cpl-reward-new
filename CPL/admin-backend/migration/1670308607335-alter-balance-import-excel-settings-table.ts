import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm'

export class alterBalanceImportExcelSettingsTable1670308607335
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex(
      'balance_import_excel_settings',
      new TableIndex({
        name: 'IDX_BALANCE_IMPORT_EXCEL_SETTINGS_UNIQUE_KEY',
        isUnique: true,
        columnNames: ['currency'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'balance_import_excel_settings',
      new TableIndex({
        name: 'IDX_BALANCE_IMPORT_EXCEL_SETTINGS_UNIQUE_KEY',
        isUnique: true,
        columnNames: ['currency'],
      }),
    )
  }
}
