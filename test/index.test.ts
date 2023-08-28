import { knex, Knex as K } from 'knex';
import Meyer from 'meyer';
import path from 'path';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import KnexDbms from '../src';

const config: K.PgConnectionConfig = Object.freeze({
  host: 'localhost',
  port: 26043,
  user: 'sa',
  password: 'Meyer#123',
  database: 'testing',
  ssl: false,
});
const dbms = new KnexDbms('pg', { ...config });

let testingKnex: K;
beforeAll(async () => {
  const boostrapConfig: K.PgConnectionConfig = {
    ...config,
    database: 'bootstrap',
  };

  const setupKnex = knex({
    client: 'pg',
    connection: boostrapConfig,
    pool: { min: 0, max: 1, idleTimeoutMillis: 100, reapIntervalMillis: 100 },
  });

  await setupKnex.raw(`DROP DATABASE IF EXISTS "testing";`);
  await setupKnex.raw(`CREATE DATABASE "testing"`);

  await setupKnex.destroy();

  testingKnex = knex({
    client: 'pg',
    connection: { ...config },
    pool: { min: 0, max: 1, idleTimeoutMillis: 100, reapIntervalMillis: 100 },
  });
});

afterAll(async () => {
  if (testingKnex) await testingKnex.destroy();
  await dbms.close();
});

describe('Knex Provider', () => {
  test('it runs migrations v1', async () => {
    const m = new Meyer({
      dbms,
      migrationsPath: path.resolve(__dirname, 'migrations-v1'),
    });
    await m.execute();

    expect(await testingKnex.table(`abc`)).toMatchSnapshot();
  });
  test('it runs migrations v2', async () => {
    const m = new Meyer({
      dbms,
      migrationsPath: path.resolve(__dirname, 'migrations-v2'),
    });
    await m.execute();
    expect(await testingKnex.table(`abc`)).toMatchSnapshot();
    expect(await testingKnex.table(`def`)).toMatchSnapshot();
  });
  test('it fails migrations v3 in prod', async () => {
    const m = new Meyer({
      dbms,
      migrationsPath: path.resolve(__dirname, 'migrations-v3'),
    });
    let err;
    try {
      await m.execute();
    } catch (e) {
      err = e;
    }
    expect(err).toMatchSnapshot();
    expect(await testingKnex.table(`abc`)).toMatchSnapshot();
    expect(await testingKnex.table(`def`)).toMatchSnapshot();
  });
  test('it runs migrations v3 in dev', async () => {
    const m = new Meyer({
      dbms,
      migrationsPath: path.resolve(__dirname, 'migrations-v3'),
      development: true,
    });
    await m.execute();
    expect(await testingKnex.table(`abc`)).toMatchSnapshot();
    expect(await testingKnex.table(`jow`)).toMatchSnapshot();
    expect(testingKnex.table(`def`)).rejects.toThrowErrorMatchingInlineSnapshot(
      `"select * from \\"def\\" - relation \\"def\\" does not exist"`,
    );
  });
});
