import EmbeddedPostgres from "embedded-postgres";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const DB_NAME = process.env.POSTGRES_DB || "daman_plastics";
const PORT = Number(process.env.POSTGRES_PORT || 5432);
const USER = process.env.POSTGRES_USER || "postgres";
const PASSWORD = process.env.POSTGRES_PASSWORD || "password";
const databaseDir = path.resolve(process.cwd(), ".data", "postgres");

const pg = new EmbeddedPostgres({
  databaseDir,
  user: USER,
  password: PASSWORD,
  port: PORT,
  persistent: true,
  autoRehydrateSymlinks: true,
  onLog: (message) => {
    if (process.env.DB_VERBOSE === "1") console.log(message);
  },
  onError: (message) => console.error(message),
});

const initialised = fs.existsSync(path.join(databaseDir, "PG_VERSION"));

async function main() {
  if (!initialised) {
    console.log(`[local-db] initialising cluster at ${databaseDir} ...`);
    await pg.initialise();
  }

  console.log(`[local-db] starting postgres on port ${PORT} ...`);
  await pg.start();

  try {
    await pg.createDatabase(DB_NAME);
    console.log(`[local-db] database "${DB_NAME}" ready`);
  } catch {
    console.log(`[local-db] database "${DB_NAME}" already exists`);
  }

  console.log(
    `[local-db] connection string: postgres://${USER}:${PASSWORD}@localhost:${PORT}/${DB_NAME}`,
  );

  if (process.env.DB_SELFTEST === "1" || process.argv.includes("--selftest")) {
    const client = pg.getPgClient();
    await client.connect();
    const result = await client.query("SELECT version()");
    console.log("[local-db] selftest ok:", result.rows[0].version);
    await client.end();
    await pg.stop();
    process.exit(0);
  }

  console.log("[local-db] running — press Ctrl+C to stop");

  const shutdown = async () => {
    console.log("\n[local-db] stopping ...");
    try {
      await pg.stop();
    } catch {
      /* already stopped */
    }
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  setInterval(() => {}, 1 << 30);
}

main().catch(async (error) => {
  console.error("[local-db] failed:", error);
  try {
    await pg.stop();
  } catch {
    /* ignore */
  }
  process.exit(1);
});
