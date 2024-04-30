import * as Spec from 'pactum/src/models/Spec';
import { pactumType } from './setup-jest';

describe('AppController (e2e)', () => {
  // let app: INestApplication;
  let pactum: pactumType

  beforeEach(() => {
    // pactum.request.setBaseUrl('http://localhost:3000');
    pactum = global.pactum 
  });

  it('/ (GET)', () => {
    return pactum.spec().get('/api/v1/auth').expectStatus(200);
  });
});
