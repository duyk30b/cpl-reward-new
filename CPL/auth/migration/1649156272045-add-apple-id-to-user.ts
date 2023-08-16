import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex,
} from 'typeorm'

export class addAppleIdToUser1649156272045 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'apple_id',
        type: 'varchar',
        isNullable: true,
      }),
    )

    await queryRunner.createIndex(
      'user',
      new TableIndex({
        name: 'INDEX_APPLE_ID',
        columnNames: ['apple_id'],
        isUnique: false,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('user', 'INDEX_APPLE_ID')
    await queryRunner.dropColumn('user', 'apple_id')
  }
}
