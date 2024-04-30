import { INestApplication } from '@nestjs/common';
import { AppFactory } from './app.factory';
import * as pactum from 'pactum';
import * as Spec from 'pactum/src/models/Spec';


let appFactory: AppFactory;
let app: INestApplication

export type pactumType = typeof pactum

global.beforeEach(async () => {
  appFactory = await AppFactory.init();
  await appFactory.initDB();
  app = appFactory.getInstance()

  pactum.request.setBaseUrl(await app.getUrl())
global.pactum = pactum 

});

global.afterEach(async () => {
  await appFactory?.cleanup();
  await app?.close() 
});
