import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex,
} from 'typeorm'

export class addChannelIdToUser1647424207762 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'channel_id',
        type: 'int',
        isNullable: true,
      }),
    )

    await queryRunner.createIndex(
      'user',
      new TableIndex({
        name: 'INDEX_CHANNEL_ID',
        columnNames: ['channel_id'],
        isUnique: false,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'channel_id')
  }
}
