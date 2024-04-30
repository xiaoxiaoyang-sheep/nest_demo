// 方法一： const app = new AppFactory().init()  init -> return app实例
// 方法二： OPP getInstance() -> app ,private app, AppFactory constructor部分进行初始化

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { setupApp } from '../src/setup';
import { DataSource } from 'typeorm';
import datasource from '../ormconfig';
import { readFileSync } from 'fs';
import { join } from 'path';

// const appFactory = AppFactory.init() -> const app = appFactory.getInstance()
export class AppFactory {
  connection: DataSource;

  constructor(private app: INestApplication) {}

  getInstance() {
    return this.app;
  }

  // 初始化app实例
  static async init() {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleFixture.createNestApplication();
    setupApp(app);
    const port = 3000;
    await app.listen(port);
    await app.init();
    return new AppFactory(app);
  }

  // 初始化db数据库
  async initDB() {
    if (!datasource.isInitialized) {
      await datasource.initialize();
    }
    this.connection = datasource;
    // 测试的基础的字典数据写入到数据库中
    // Method1: this.connection.runMigrations()
    // Method2: 写入sql语句
    const queryRunner = this.connection.createQueryRunner();

    const sql = readFileSync(join(__dirname, '../src/migrations/init.sql'))
      .toString()
      .replace(/\r?(\n|\r)?/g, '')
      .split(';') || [];

    //   await queryRunner.query("SET NAMES utf8mb4")
    //   await queryRunner.query("SET FOREIGN_KEY_CHECKS = 0")
    //   await queryRunner.query("DROP TABLE IF EXISTS `menu`")
    //   await queryRunner.query("  CREATE TABLE `menu` (`id` int NOT NULL AUTO_INCREMENT,`name` varchar(255) NOT NULL,`path` varchar(255) NOT NULL,`order` int NOT NULL,`acl` varchar(255) NOT NULL,PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci")
    //   await queryRunner.query("BEGIN")
    //   await queryRunner.query("COMMIT")
    for(let line of sql) {
        if(line === '') continue
        await queryRunner.query(line)
        // console.log(line);
    }
  }

  // 清除数据库数据 -> 避免测试数据污染
  async cleanup() {
    const entities = this.connection.entityMetadatas;
    for (let entity of entities) {
      const repository = this.connection.getRepository(entity.name);
      await repository.query('SET FOREIGN_KEY_CHECKS = 0');
      await repository.query(`DELETE FROM ${entity.tableName}`);
      await repository.query('SET FOREIGN_KEY_CHECKS = 1');
    }
  }

  // 断开与数据库的链接 -> 避免后续数据库连接过多而无法连接
  async destory() {
    await this.connection?.destroy();
  }
}
