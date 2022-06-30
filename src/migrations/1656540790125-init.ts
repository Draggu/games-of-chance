import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1656540790125 implements MigrationInterface {
    name = 'init1656540790125';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "user_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying NOT NULL, "balance" integer NOT NULL DEFAULT '0', CONSTRAINT "BalanceNotNegativeConstraint" CHECK ("balance" >= 0), CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "auth_token_entity" ("name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(), "expiresAt" TIMESTAMP NOT NULL DEFAULT NOW() + INTERVAL '30 days', "token" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid, CONSTRAINT "unique_token_name_per_user" UNIQUE ("name", "userId"), CONSTRAINT "CHK_8eacc7f54eb8e9ce2a7d045115" CHECK (
            "expiresAt" > "createdAt" AND "expiresAt" - "createdAt" <= INTERVAL '30 days'
        ), CONSTRAINT "PK_192d85f25183339c9439796bade" PRIMARY KEY ("token"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "dice_roll_entity" ("id" SERIAL NOT NULL, "side" character varying NOT NULL, "chances" integer NOT NULL, "winning" integer NOT NULL, "amount" integer NOT NULL, "won" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(), "userId" uuid, "seedId" uuid, CONSTRAINT "PK_a522f9dc8cafa1b2bcbb0a4aa9d" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "dice_seed_entity" ("previousServerSeed" character varying(64), "serverSeed" character varying(64) NOT NULL, "nextServerSeed" character varying(64) NOT NULL, "clientSeed" character varying(64) NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "REL_65f834871572a6d8e90d806205" UNIQUE ("userId"), CONSTRAINT "PK_65f834871572a6d8e90d8062052" PRIMARY KEY ("userId"))`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."RouletteBetColor" AS ENUM('red', 'green', 'black')`,
        );
        await queryRunner.query(
            `CREATE TABLE "roulette_bet_entity" ("id" SERIAL NOT NULL, "amount" integer NOT NULL, "color" "public"."RouletteBetColor" NOT NULL, "isRewarded" boolean NOT NULL DEFAULT false, "userId" uuid NOT NULL, "rollId" integer NOT NULL, CONSTRAINT "PK_94ce6215bd84be2078fd288ac82" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "roulette_roll_entity" ("id" integer NOT NULL, "winning" smallint NOT NULL, "color" "public"."RouletteBetColor" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(), "seedId" integer, CONSTRAINT "PK_073b97364cd625e4356df33de27" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE INDEX "get_newest_one_faster" ON "roulette_roll_entity" ("createdAt") `,
        );
        await queryRunner.query(
            `CREATE TABLE "roulette_seed_entity" ("id" SERIAL NOT NULL, "day" date NOT NULL DEFAULT ('now'::text)::date, "privateKey" character varying(64) NOT NULL, "publicKey" character varying(64) NOT NULL, CONSTRAINT "UQ_d0f7b4c68b33fc4a69b1d5222f2" UNIQUE ("day"), CONSTRAINT "PK_7cb6cacdaac4fb1a024b7c9c007" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "roulette_stats_entity" ("id" smallint NOT NULL DEFAULT '1', "greenCount" integer NOT NULL DEFAULT '0', "blackCount" integer NOT NULL DEFAULT '0', "redCount" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_eebfb724320c87d69ffa534e711" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "auth_token_entity" ADD CONSTRAINT "FK_38cb71c81b02bd2c9812f61325d" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "dice_roll_entity" ADD CONSTRAINT "FK_770621e37c992fed208b7f281cd" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "dice_roll_entity" ADD CONSTRAINT "FK_9b49f009e6d6af48221fe678b69" FOREIGN KEY ("seedId") REFERENCES "dice_seed_entity"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "dice_seed_entity" ADD CONSTRAINT "FK_65f834871572a6d8e90d8062052" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "roulette_bet_entity" ADD CONSTRAINT "FK_1a95b6218c37a2e78102012f7ec" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "roulette_bet_entity" ADD CONSTRAINT "FK_db379c5ff04aa1886f4a282d93b" FOREIGN KEY ("rollId") REFERENCES "roulette_roll_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "roulette_roll_entity" ADD CONSTRAINT "FK_e53367e2835aa5603ca2566ae50" FOREIGN KEY ("seedId") REFERENCES "roulette_seed_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "roulette_roll_entity" DROP CONSTRAINT "FK_e53367e2835aa5603ca2566ae50"`,
        );
        await queryRunner.query(
            `ALTER TABLE "roulette_bet_entity" DROP CONSTRAINT "FK_db379c5ff04aa1886f4a282d93b"`,
        );
        await queryRunner.query(
            `ALTER TABLE "roulette_bet_entity" DROP CONSTRAINT "FK_1a95b6218c37a2e78102012f7ec"`,
        );
        await queryRunner.query(
            `ALTER TABLE "dice_seed_entity" DROP CONSTRAINT "FK_65f834871572a6d8e90d8062052"`,
        );
        await queryRunner.query(
            `ALTER TABLE "dice_roll_entity" DROP CONSTRAINT "FK_9b49f009e6d6af48221fe678b69"`,
        );
        await queryRunner.query(
            `ALTER TABLE "dice_roll_entity" DROP CONSTRAINT "FK_770621e37c992fed208b7f281cd"`,
        );
        await queryRunner.query(
            `ALTER TABLE "auth_token_entity" DROP CONSTRAINT "FK_38cb71c81b02bd2c9812f61325d"`,
        );
        await queryRunner.query(`DROP TABLE "roulette_stats_entity"`);
        await queryRunner.query(`DROP TABLE "roulette_seed_entity"`);
        await queryRunner.query(`DROP INDEX "public"."get_newest_one_faster"`);
        await queryRunner.query(`DROP TABLE "roulette_roll_entity"`);
        await queryRunner.query(`DROP TYPE "public"."RouletteBetColor"`);
        await queryRunner.query(`DROP TABLE "roulette_bet_entity"`);
        await queryRunner.query(`DROP TYPE "public"."RouletteBetColor"`);
        await queryRunner.query(`DROP TABLE "dice_seed_entity"`);
        await queryRunner.query(`DROP TABLE "dice_roll_entity"`);
        await queryRunner.query(`DROP TABLE "auth_token_entity"`);
        await queryRunner.query(`DROP TABLE "user_entity"`);
    }
}
