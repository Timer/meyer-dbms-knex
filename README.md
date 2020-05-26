# `meyer-dbms-knex`

Provides generic migration support in meyer via Knex.

## Development

### Requirements

1. Docker 17.05 or newer (`brew cask install docker`)
1. Node 10 LTS (optionally using [`n-install`](https://github.com/mklement0/n-install), run `n 10`)
1. Yarn 1.12+ (`curl -o- -L https://yarnpkg.com/install.sh | bash`)

### Environment

To setup a local development environment, run `docker-compose up -d`.
This will start the required components for you to get up and running.

You can tear down this environment at any time by running `docker-compose down --volumes --remove-orphans`.
You may also need to run this command if your database gets in a weird state (e.g. app fails to boot).

To suspend resource usage but not completely destroy the environment, just run `docker-compose down`.

### Developing

#### tl;dr

1. First, make sure your dependencies are up to date by running `yarn install --check-files`.
1. Next, ensure you refreshed your [environment](#environment) by running `docker-compose up -d`.
   - you should see something like (`meyer-dbms-knex_db_* is up-to-date`)
1. Finally, run `yarn test --watch` in the root of the repository. Knock out some features!
