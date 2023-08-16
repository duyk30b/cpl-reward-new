import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addProvidersToUserKyc1661151873810 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('user_kyc', [
      new TableColumn({
        name: 'image_providers',
        type: 'varchar',
        length: '255',
        default: '"[]"',
      }),
      new TableColumn({
        name: 'risk_scan_providers',
        type: 'varchar',
        length: '255',
        default: '"[]"',
      }),
    ])

    await queryRunner.addColumns('user_kyc_history', [
      new TableColumn({
        name: 'image_providers',
        type: 'varchar',
        length: '255',
        default: '"[]"',
      }),
      new TableColumn({
        name: 'risk_scan_providers',
        type: 'varchar',
        length: '255',
        default: '"[]"',
      }),
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('user_kyc', [
      'image_providers',
      'risk_scan_providers',
    ])

    await queryRunner.dropColumns('user_kyc_history', [
      'image_providers',
      'risk_scan_providers',
    ])
  }
}
