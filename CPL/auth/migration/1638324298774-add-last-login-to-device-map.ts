import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addLastLoginToDeviceMap1638324298774
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('device_map', [
      new TableColumn({
        name: 'last_login',
        type: 'bigInt',
        isNullable: true,
      }),
      new TableColumn({
        name: 'last_ip',
        type: 'varchar',
        isNullable: true,
      }),
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('device_map', ['last_login', 'last_ip'])
  }
}
