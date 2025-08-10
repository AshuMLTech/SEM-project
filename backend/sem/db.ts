import { SQLDatabase } from 'encore.dev/storage/sqldb';

export const semDB = new SQLDatabase("sem", {
  migrations: "./migrations",
});
