# `meyer-dbms-knex`

Provides generic migration support in meyer via Knex.

## Development

### Requirements

1. [Podman](https://podman.io/docs/installation)
1. Node 18 LTS

### Environment

To setup a local development environment, run `podman-compose up -d`.
This will start the required components for you to get up and running.

You can tear down this environment at any time by running `podman-compose down --volumes --remove-orphans`.
You may also need to run this command if your database gets in a weird state (e.g. app fails to boot).

To suspend resource usage but not completely destroy the environment, just run `podman-compose down`.

### Developing

#### tl;dr

1. First, make sure your dependencies are up to date by running `pnpm i`.
1. Next, ensure you refreshed your [environment](#environment) by running `podman-compose up -d`.
   - you should see something like (`meyer-dbms-knex_db_* is up-to-date`)
1. Finally, run `pnpm test` in the root of the repository. Knock out some features!
