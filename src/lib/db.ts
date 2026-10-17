import { createClient } from "@libsql/client";
import path from "path";
import fs from "fs";

const isVercel = process.env.VERCEL === "1";
const dbUrl =
  process.env.TURSO_DATABASE_URL ||
  (isVercel ? "file:/tmp/kws2026.db" : "file:data/kws2026.db");

if (!process.env.TURSO_DATABASE_URL && !isVercel) {
  const dbDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
}

export const db = createClient({
  url: dbUrl,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

let isInitialized = false;

export async function initDb() {
  if (isInitialized) return;
  await db.execute(`
    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reference_code TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      occupation TEXT,
      city_country TEXT,
      attendance_type TEXT NOT NULL,
      expectations TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  isInitialized = true;
}

export interface Registration {
  id?: number;
  reference_code: string;
  full_name: string;
  email: string;
  phone: string;
  occupation?: string;
  city_country?: string;
  attendance_type: "in-person" | "virtual";
  expectations?: string;
  created_at?: string;
}

export async function createRegistration(
  data: Omit<Registration, "id" | "reference_code" | "created_at">
): Promise<Registration> {
  await initDb();
  const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
  const reference_code = `KWS2026-${randomHex}`;

  const result = await db.execute({
    sql: `
      INSERT INTO registrations (reference_code, full_name, email, phone, occupation, city_country, attendance_type, expectations)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      reference_code,
      data.full_name,
      data.email,
      data.phone,
      data.occupation || "",
      data.city_country || "",
      data.attendance_type,
      data.expectations || "",
    ],
  });

  return {
    id: Number(result.lastInsertRowid || 0),
    reference_code,
    ...data,
  };
}

export async function getRegistrationByEmail(
  email: string
): Promise<Registration | undefined> {
  await initDb();
  const result = await db.execute({
    sql: "SELECT * FROM registrations WHERE email = ?",
    args: [email],
  });

  if (result.rows.length === 0) return undefined;
  return result.rows[0] as unknown as Registration;
}

export async function getAllRegistrations(
  search?: string,
  filterType?: string
): Promise<Registration[]> {
  await initDb();
  let query = "SELECT * FROM registrations WHERE 1=1";
  const args: string[] = [];

  if (search) {
    query +=
      " AND (full_name LIKE ? OR email LIKE ? OR phone LIKE ? OR reference_code LIKE ?)";
    const searchPattern = `%${search}%`;
    args.push(searchPattern, searchPattern, searchPattern, searchPattern);
  }

  if (filterType && filterType !== "all") {
    query += " AND attendance_type = ?";
    args.push(filterType);
  }

  query += " ORDER BY created_at DESC";

  const result = await db.execute({
    sql: query,
    args,
  });

  return result.rows as unknown as Registration[];
}

export async function getStats() {
  await initDb();
  const totalRes = await db.execute("SELECT COUNT(*) as count FROM registrations");
  const inPersonRes = await db.execute(
    "SELECT COUNT(*) as count FROM registrations WHERE attendance_type = 'in-person'"
  );
  const virtualRes = await db.execute(
    "SELECT COUNT(*) as count FROM registrations WHERE attendance_type = 'virtual'"
  );

  return {
    total: Number(totalRes.rows[0]?.count || 0),
    inPerson: Number(inPersonRes.rows[0]?.count || 0),
    virtual: Number(virtualRes.rows[0]?.count || 0),
  };
}
