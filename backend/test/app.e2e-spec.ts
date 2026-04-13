import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('ReTech E2E', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();
  }, 30000);

  afterAll(async () => {
    await app.close();
  });

  // ── 1. teszt eset: Autentikáció ────────────────────────────────────────────

  test('POST /api/authorise/register --> 201 (sikeres regisztráció)', () => {
    return request(app.getHttpServer())
      .post('/api/authorise/register')
      .field('email', `e2e_${Date.now()}@test.com`)
      .field('username', 'e2etester')
      .field('password', 'jelszo123')
      .expect(201);
  });

  test('POST /api/authorise/register --> 400 (hiányos adatok)', () => {
    return request(app.getHttpServer())
      .post('/api/authorise/register')
      .field('email', 'csak@email.com')
      .expect(400);
  });

  test('POST /api/authorise/login --> 401 (nem létező felhasználó)', () => {
    return request(app.getHttpServer())
      .post('/api/authorise/login')
      .send({ email: 'nemletezik@test.com', password: 'barmijelszo' })
      .expect(401);
  });

  test('GET /api/authorise/me --> 401 (nincs Bearer token)', () => {
    return request(app.getHttpServer())
      .get('/api/authorise/me')
      .expect(401);
  });

  // ── 2. teszt eset: Termékek ────────────────────────────────────────────────

  test('GET /api/products --> 200 (publikus lista, tömböt ad vissza)', () => {
    return request(app.getHttpServer())
      .get('/api/products')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  test('GET /api/products/9999 --> 404 (nem létező termék)', () => {
    return request(app.getHttpServer())
      .get('/api/products/9999')
      .expect(404);
  });

  test('POST /api/products --> 401 (nincs bejelentkezve)', () => {
    return request(app.getHttpServer())
      .post('/api/products')
      .field('title', 'Teszt termék')
      .expect(401);
  });
});
