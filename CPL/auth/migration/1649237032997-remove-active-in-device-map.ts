import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class removeActiveInDeviceMap1649237032997
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('device_map', 'active')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'device_map',
      new TableColumn({
        name: 'active',
        type: 'boolean',
        default: 1,
      }),
    )
  }
}
