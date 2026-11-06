import EmbeddedPostgres from "embedded-postgres";
import { spawn } from "node:child_process";
import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

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

/** Read DATABASE_URL from the environment or the project's .env file. */
function readDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  try {
    const env = fs.readFileSync(path.resolve(process.cwd(), ".env"), "utf8");
    const match = /^DATABASE_URL\s*=\s*(.+)$/m.exec(env);
    return match ? match[1].trim().replace(/^['"]|['"]$/g, "") : undefined;
  } catch {
    return undefined;
  }
}

function isLocalDatabase() {
  const url = readDatabaseUrl();
  if (!url) return true;
  try {
    const host = new URL(url).hostname;
    return host === "localhost" || host === "127.0.0.1" || host === "::1" || host === "[::1]";
  } catch {
    return true;
  }
}

function isPortOpen() {
  return new Promise((resolve) => {
    const socket = net.connect({ host: "127.0.0.1", port: PORT });
    const done = (open) => {
      socket.destroy();
      resolve(open);
    };
    socket.setTimeout(1000);
    socket.once("connect", () => done(true));
    socket.once("timeout", () => done(false));
    socket.once("error", () => done(false));
  });
}

/**
 * `--ensure`: make sure a local database is listening, then exit.
 * Used by `npm run dev` so the app never boots against a dead connection.
 */
async function ensure() {
  if (!isLocalDatabase()) {
    console.log("[local-db] DATABASE_URL points at a remote host — not starting local postgres");
    return;
  }

  if (await isPortOpen()) {
    console.log(`[local-db] already running on port ${PORT}`);
    return;
  }

  console.log(`[local-db] no database on port ${PORT} — starting one ...`);
  const child = spawn(process.execPath, [fileURLToPath(import.meta.url)], {
    detached: true,
    stdio: "ignore",
  });
  child.unref();

  const deadline = Date.now() + 90_000;
  while (Date.now() < deadline) {
    if (await isPortOpen()) {
      console.log(`[local-db] ready on port ${PORT}`);
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.error(`[local-db] timed out waiting for port ${PORT} — run \`npm run db\` to see why`);
  process.exitCode = 1;
}

async function main() {
  if (process.argv.includes("--ensure")) {
    await ensure();
    return;
  }

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
