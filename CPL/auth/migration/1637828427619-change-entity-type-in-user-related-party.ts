import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class changeEntityTypeInUserRelatedParty1637828427619
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'user_related_party',
      'entity_type',
      new TableColumn({
        name: 'entity_type',
        type: 'varchar',
        isNullable: true,
      }),
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
