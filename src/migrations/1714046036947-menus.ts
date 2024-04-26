import { MigrationInterface, QueryRunner } from "typeorm";

export class menus1714046036947 implements MigrationInterface {
    name = 'menus1714046036947'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`menu\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`path\` varchar(255) NOT NULL, \`order\` int NOT NULL, \`acl\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`role_menus\` (\`menuId\` int NOT NULL, \`rolesId\` int NOT NULL, INDEX \`IDX_b447ba2d495fdf8e4a489afa3f\` (\`menuId\`), INDEX \`IDX_135e41fb3c98312c5f171fe9f1\` (\`rolesId\`), PRIMARY KEY (\`menuId\`, \`rolesId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`role_menus\` ADD CONSTRAINT \`FK_b447ba2d495fdf8e4a489afa3fc\` FOREIGN KEY (\`menuId\`) REFERENCES \`menu\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`role_menus\` ADD CONSTRAINT \`FK_135e41fb3c98312c5f171fe9f1c\` FOREIGN KEY (\`rolesId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`role_menus\` DROP FOREIGN KEY \`FK_135e41fb3c98312c5f171fe9f1c\``);
        await queryRunner.query(`ALTER TABLE \`role_menus\` DROP FOREIGN KEY \`FK_b447ba2d495fdf8e4a489afa3fc\``);
        await queryRunner.query(`DROP INDEX \`IDX_135e41fb3c98312c5f171fe9f1\` ON \`role_menus\``);
        await queryRunner.query(`DROP INDEX \`IDX_b447ba2d495fdf8e4a489afa3f\` ON \`role_menus\``);
        await queryRunner.query(`DROP TABLE \`role_menus\``);
        await queryRunner.query(`DROP TABLE \`menu\``);
    }

}
