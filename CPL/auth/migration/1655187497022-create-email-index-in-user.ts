import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm'

export class createEmailIndexInUser1655187497022 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex(
      'user',
      new TableIndex({
        name: 'INDEX_EMAIL',
        columnNames: ['email'],
        isUnique: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('user', 'INDEX_EMAIL')
  }
}
