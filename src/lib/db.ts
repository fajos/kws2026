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

  await db.execute(`
    CREATE TABLE IF NOT EXISTS journal_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      full_name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS journal_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      year INTEGER NOT NULL,
      data TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, year)
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS journal_email_reminders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      email TEXT NOT NULL,
      frequency TEXT NOT NULL DEFAULT 'weekly',
      day_of_week TEXT DEFAULT 'Monday',
      time_of_day TEXT DEFAULT '08:00',
      last_sent_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id)
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

// ----------------------------------------------------
// Journal & Auth Types and Database Helpers
// ----------------------------------------------------

export interface JournalUser {
  id: number;
  email: string;
  password_hash: string;
  salt: string;
  full_name: string;
  created_at: string;
}

export interface JournalEntry {
  id: number;
  user_id: number;
  year: number;
  data: string;
  updated_at: string;
}

export interface JournalReminder {
  id: number;
  user_id: number;
  email: string;
  frequency: "daily" | "weekly" | "monthly" | "disabled";
  day_of_week: string;
  time_of_day: string;
  last_sent_at?: string;
  created_at: string;
}

export async function createJournalUser(data: {
  email: string;
  password_hash: string;
  salt: string;
  full_name: string;
}): Promise<JournalUser> {
  await initDb();
  const result = await db.execute({
    sql: `
      INSERT INTO journal_users (email, password_hash, salt, full_name)
      VALUES (?, ?, ?, ?)
    `,
    args: [data.email.toLowerCase().trim(), data.password_hash, data.salt, data.full_name.trim()],
  });

  const id = Number(result.lastInsertRowid || 0);
  return {
    id,
    email: data.email.toLowerCase().trim(),
    password_hash: data.password_hash,
    salt: data.salt,
    full_name: data.full_name.trim(),
    created_at: new Date().toISOString(),
  };
}

export async function getJournalUserByEmail(email: string): Promise<JournalUser | undefined> {
  await initDb();
  const result = await db.execute({
    sql: "SELECT * FROM journal_users WHERE email = ?",
    args: [email.toLowerCase().trim()],
  });
  if (result.rows.length === 0) return undefined;
  return result.rows[0] as unknown as JournalUser;
}

export async function getJournalUserById(id: number): Promise<JournalUser | undefined> {
  await initDb();
  const result = await db.execute({
    sql: "SELECT * FROM journal_users WHERE id = ?",
    args: [id],
  });
  if (result.rows.length === 0) return undefined;
  return result.rows[0] as unknown as JournalUser;
}

export async function saveJournalEntry(userId: number, year: number, dataJson: string): Promise<void> {
  await initDb();
  await db.execute({
    sql: `
      INSERT INTO journal_entries (user_id, year, data, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id, year) DO UPDATE SET
        data = excluded.data,
        updated_at = CURRENT_TIMESTAMP
    `,
    args: [userId, year, dataJson],
  });
}

export async function getJournalEntry(userId: number, year: number): Promise<JournalEntry | undefined> {
  await initDb();
  const result = await db.execute({
    sql: "SELECT * FROM journal_entries WHERE user_id = ? AND year = ?",
    args: [userId, year],
  });
  if (result.rows.length === 0) return undefined;
  return result.rows[0] as unknown as JournalEntry;
}

export async function getAllJournalYearsForUser(userId: number): Promise<number[]> {
  await initDb();
  const result = await db.execute({
    sql: "SELECT year FROM journal_entries WHERE user_id = ? ORDER BY year ASC",
    args: [userId],
  });
  return result.rows.map((r) => Number((r as any).year));
}

export async function saveJournalReminder(
  userId: number,
  email: string,
  frequency: "daily" | "weekly" | "monthly" | "disabled",
  dayOfWeek: string = "Monday",
  timeOfDay: string = "08:00"
): Promise<void> {
  await initDb();
  await db.execute({
    sql: `
      INSERT INTO journal_email_reminders (user_id, email, frequency, day_of_week, time_of_day)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET
        email = excluded.email,
        frequency = excluded.frequency,
        day_of_week = excluded.day_of_week,
        time_of_day = excluded.time_of_day
    `,
    args: [userId, email.toLowerCase().trim(), frequency, dayOfWeek, timeOfDay],
  });
}

export async function getJournalReminder(userId: number): Promise<JournalReminder | undefined> {
  await initDb();
  const result = await db.execute({
    sql: "SELECT * FROM journal_email_reminders WHERE user_id = ?",
    args: [userId],
  });
  if (result.rows.length === 0) return undefined;
  return result.rows[0] as unknown as JournalReminder;
}

export async function updateReminderLastSent(userId: number): Promise<void> {
  await initDb();
  await db.execute({
    sql: "UPDATE journal_email_reminders SET last_sent_at = CURRENT_TIMESTAMP WHERE user_id = ?",
    args: [userId],
  });
}

