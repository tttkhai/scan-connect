import { MigrationInterface, QueryRunner } from "typeorm";

export class CREATEUSER1723254358222 implements MigrationInterface {
    name = 'CREATEUSER1723254358222'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "first_name" character varying(50) NOT NULL, "last_name" character varying(50) NOT NULL, "gender" character varying(50) NOT NULL DEFAULT '', "birthday" TIMESTAMP WITH TIME ZONE NOT NULL, "email" character varying(50) NOT NULL DEFAULT '', "phone" character varying(15) NOT NULL DEFAULT '', "website" character varying(50) NOT NULL DEFAULT '', "title" character varying(50) NOT NULL DEFAULT '', "created_date" TIMESTAMP WITH TIME ZONE NOT NULL, "updated_date" TIMESTAMP WITH TIME ZONE NOT NULL, "link_id" character varying NOT NULL, "qr_path" character varying NOT NULL, "avatar_path" character varying NOT NULL, "is_private" boolean NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
