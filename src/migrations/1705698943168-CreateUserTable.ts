import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1701364077151 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user" (
        "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
        "firstName" character varying(50) NOT NULL DEFAULT '',
        "lastName" character varying(50) NOT NULL DEFAULT '',
        "gender" character varying(50) NOT NULL DEFAULT '',
        "birthday" TIMESTAMP,
        "email" character varying(50) NOT NULL DEFAULT '',
        "phone" character varying(15),
        "website" character varying(50),
        "title" character varying(50),
        "createdDate" TIMESTAMP,
        "updatedDate" TIMESTAMP,
        "linkId" character varying(50),
        "qrPath" character varying(50),
        "isPrivate" boolean
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
