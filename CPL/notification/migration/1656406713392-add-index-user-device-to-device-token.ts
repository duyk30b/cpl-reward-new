import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm'

export class addIndexUserDeviceToDeviceToken1656406713392
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex(
      'device_token',
      new TableIndex({
        name: 'INDEX_USER_DEVICE',
        columnNames: ['user_id', 'device_id'],
        isUnique: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('device_token', 'INDEX_USER_DEVICE')
  }
}
