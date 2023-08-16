/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  TableIndex,
} from 'typeorm'

export class dropPermissionForeignInUserPermission1652945254196
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('user_permission')
    const foreignKeys = table.foreignKeys.filter(
      (key) => key.referencedTableName == 'permission',
    )

    await queryRunner.dropForeignKeys('user_permission', foreignKeys)

    await queryRunner.createIndex(
      'user_permission',
      new TableIndex({
        name: 'INDEX_PERMISSION_ID',
        columnNames: ['permission_id'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'user_permission',
      new TableForeignKey({
        columnNames: ['permission_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'permission',
      }),
    )
    await queryRunner.dropIndex('user_permission', 'INDEX_PERMISSION_ID')
  }
}
