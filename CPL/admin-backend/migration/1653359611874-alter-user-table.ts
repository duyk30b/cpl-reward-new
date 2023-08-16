import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class alterUserTable1653359611874 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('user', [
      'first_name',
      'last_name',
      'fullname',
      'phone',
      'phone_country',
    ])

    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'name',
        type: 'varchar',
        isNullable: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('user', [
      new TableColumn({
        name: 'first_name',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'last_name',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'fullname',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'phone',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'phone_country',
        type: 'varchar',
        isNullable: true,
      }),
    ])

    await queryRunner.dropColumn('user', 'name')
  }
}
