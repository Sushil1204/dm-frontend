process.loadEnvFile(".env");
const postgres = (await import("postgres")).default;
const sql = postgres(process.env.DATABASE_URL);
const rows = await sql`select id, name, email, status, "enquiryType", "sourcePath", "consentAt" from enquiries order by id desc limit 5`;
console.log(JSON.stringify(rows, null, 2));
await sql.end();
