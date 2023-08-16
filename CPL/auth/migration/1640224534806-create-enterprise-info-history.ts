import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm'

export class createEnterpriseInfoHistory1640224534806
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'enterprise_info_history',
        columns: [
          {
            name: 'id',
            type: 'bigInt',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'user_id',
            type: 'bigInt',
          },
          {
            name: 'applicant_name',
            type: 'varchar',
            comment: 'Applicant’s Name',
          },
          {
            name: 'company_name',
            type: 'varchar',
          },
          {
            name: 'company_register_country',
            type: 'int',
            comment: 'Company Registered Country/Region',
          },
          {
            name: 'contact_number',
            type: 'varchar',
          },
          {
            name: 'login_email',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'company_location',
            type: 'varchar',
          },
          {
            name: 'applicant_job_title',
            type: 'varchar',
            comment: 'Applicant’s Job Title',
          },
          {
            name: 'sources_funding',
            type: 'bigint',
            comment: 'Sources of Funding',
          },
          {
            name: 'funding_currency',
            type: 'varchar',
          },
          {
            name: 'url_website',
            type: 'varchar',
            comment: 'URL Company website',
          },
          {
            name: 'entity_type',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'registered_date',
            type: 'date',
            comment: 'Registration application date',
          },
          {
            name: 'ownership_structure_layer',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'incorporation_number',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'reason_apply',
            type: 'varchar',
            comment:
              'Reason to Apply Enterprise - Level Identity Authentication',
          },
          {
            name: 'user_related_parties',
            type: 'longtext',
            isNullable: true,
            comment: 'JSON of user related parties',
          },
          {
            name: 'created_at',
            type: 'bigInt',
            isNullable: true,
          },
          {
            name: 'updated_at',
            type: 'bigInt',
            isNullable: true,
          },
        ],
      }),
      true,
    )
    await queryRunner.createForeignKey(
      'enterprise_info_history',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('enterprise_info_history')
    await queryRunner.dropForeignKeys(
      'enterprise_info_history',
      table.foreignKeys,
    )
    await queryRunner.dropTable('enterprise_info_history', true)
  }
}
