import * as migration_20261105_145003_initial from './20261105_145003_initial';

export const migrations = [
  {
    up: migration_20261105_145003_initial.up,
    down: migration_20261105_145003_initial.down,
    name: '20261105_145003_initial'
  },
];
