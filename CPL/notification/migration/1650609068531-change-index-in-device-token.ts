/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm'

export class changeIndexInDeviceToken1650609068531
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('device_token', 'INDEX_TOKEN')
    await queryRunner.dropIndex('device_token', 'INDEX_DEVICE_ID')

    await queryRunner.createIndex(
      'device_token',
      new TableIndex({
        name: 'INDEX_TOKEN',
        columnNames: ['token'],
      }),
    )

    await queryRunner.createIndex(
      'device_token',
      new TableIndex({
        name: 'INDEX_DEVICE_ID',
        columnNames: ['device_id'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
