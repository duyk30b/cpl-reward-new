import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class alterProviderColumnInUserKyc1654050897836
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user_kyc', 'provider')
    await queryRunner.dropColumn('user_kyc_history', 'provider')

    await queryRunner.addColumns('user_kyc', [
      new TableColumn({
        name: 'image_provider',
        type: 'int',
        default: 1,
      }),
      new TableColumn({
        name: 'risk_scan_provider',
        type: 'int',
        default: 1,
      }),
    ])

    await queryRunner.addColumns('user_kyc_history', [
      new TableColumn({
        name: 'image_provider',
        type: 'int',
        default: 1,
      }),
      new TableColumn({
        name: 'risk_scan_provider',
        type: 'int',
        default: 1,
      }),
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('user_kyc', [
      'image_provider',
      'risk_scan_provider',
    ])
    await queryRunner.dropColumns('user_kyc_history', [
      'image_provider',
      'risk_scan_provider',
    ])

    await queryRunner.addColumns('user_kyc', [
      new TableColumn({
        name: 'provider',
        type: 'int',
        default: 1,
      }),
    ])
    await queryRunner.addColumns('user_kyc_history', [
      new TableColumn({
        name: 'provider',
        type: 'int',
        default: 1,
      }),
    ])
  }
}
