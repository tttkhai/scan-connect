import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLoginTypeToUser1723818807417 implements MigrationInterface {
    name = 'AddLoginTypeToUser1723818807417'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_logintype_enum" AS ENUM('manual', 'google')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "loginType" "public"."user_logintype_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "bio" character varying(50) NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "bio"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "loginType"`);
        await queryRunner.query(`DROP TYPE "public"."user_logintype_enum"`);
    }

}
