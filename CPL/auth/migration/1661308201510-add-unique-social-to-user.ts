/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm'

export class addUniqueSocialToUser1661308201510 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('user', 'INDEX_FB_ID')
    await queryRunner.dropIndex('user', 'INDEX_GG_ID')
    await queryRunner.dropIndex('user', 'INDEX_APPLE_ID')
    await queryRunner.createIndex(
      'user',
      new TableIndex({
        name: 'INDEX_FB_ID',
        columnNames: ['fb_id'],
        isUnique: true,
      }),
    )
    await queryRunner.createIndex(
      'user',
      new TableIndex({
        name: 'INDEX_GG_ID',
        columnNames: ['gg_id'],
        isUnique: true,
      }),
    )
    await queryRunner.createIndex(
      'user',
      new TableIndex({
        name: 'INDEX_APPLE_ID',
        columnNames: ['apple_id'],
        isUnique: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
