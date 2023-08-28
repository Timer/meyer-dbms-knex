import { knex, Knex as K } from 'knex';
import { BaseDbms, Migration } from 'meyer';

export default class KnexDbms extends BaseDbms {
  private knex: K;

  constructor(client: K.Config['client'], config: K.Config['connection']) {
    super();
    this.knex = knex({
      client: client,
      connection: config,
      pool: { min: 0, max: 1, idleTimeoutMillis: 100, reapIntervalMillis: 100 },
    });
  }

  listMigrations = async (tableName: string): Promise<Migration[]> => {
    if (!(await this.knex.schema.hasTable(tableName))) {
      await new Promise((resolve, reject) =>
        this.knex.schema
          .createTable(tableName, (table) => {
            table.integer('id').primary().notNullable();
            table.text('name').notNullable();
            table.text('up').notNullable();
            table.text('down').notNullable();
            table.text('checksum').notNullable();
          })
          .then(resolve, reject),
      );
    }

    const migrations: Migration[] = (await this.knex
      .table(tableName)
      .select('id', 'name', 'up', 'down', 'checksum')) as Migration[];
    return migrations;
  };

  applyMigration = async (
    tableName: string,
    migration: Migration,
    opts: {
      checkEffects?: boolean;
    },
  ): Promise<void> => {
    await this.knex.transaction(async (trx) => {
      await trx.raw(migration.up);
      if (opts.checkEffects) {
        await trx.raw(migration.down);
        await trx.raw(migration.up);
      }
      await trx.table(tableName).insert(migration);
    });
  };

  revertMigration = async (
    tableName: string,
    migration: Migration,
  ): Promise<void> => {
    await this.knex.transaction(async (trx) => {
      await trx.raw(migration.down);
      await trx.table(tableName).where('id', migration.id).delete();
    });
  };

  close = async () => {
    await this.knex.destroy();
  };
}
