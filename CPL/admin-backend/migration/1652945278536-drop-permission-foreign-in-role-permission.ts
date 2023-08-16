/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  TableIndex,
} from 'typeorm'

export class dropPermissionForeignInRolePermission1652945278536
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('role_permission')
    const foreignKeys = table.foreignKeys.filter(
      (key) => key.referencedTableName == 'permission',
    )

    await queryRunner.dropForeignKeys('role_permission', foreignKeys)

    await queryRunner.createIndex(
      'role_permission',
      new TableIndex({
        name: 'INDEX_PERMISSION_ID',
        columnNames: ['permission_id'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'role_permission',
      new TableForeignKey({
        columnNames: ['permission_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'permission',
      }),
    )
    await queryRunner.dropIndex('role_permission', 'INDEX_PERMISSION_ID')
  }
}
