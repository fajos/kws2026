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

// ----------------------------------------------------
// Admin Journal Inspection & Follow-Up Helpers
// ----------------------------------------------------

export interface AdminJournalGoalItem {
  area: string;
  text: string;
  isTopThree: boolean;
  whyItMatters?: string;
  supportNeeded?: string;
  milestones?: { q1?: string; q2?: string; q3?: string; q4?: string };
}

export interface AdminJournalMember {
  id: number;
  email: string;
  full_name: string;
  created_at: string;
  entry_year?: number;
  entry_updated_at?: string;
  has_goals: boolean;
  total_goals_count: number;
  top_three_goals: { area: string; text: string }[];
  all_goals: AdminJournalGoalItem[];
  reminder_frequency: string;
  reminder_day?: string;
  last_reminder_sent?: string;
}

export interface JournalAdminStats {
  totalUsers: number;
  usersWithGoals: number;
  usersWithReminders: number;
}

export async function getAdminJournalMembers(
  year: number = new Date().getFullYear(),
  search?: string,
  filter?: string
): Promise<AdminJournalMember[]> {
  await initDb();

  let query = `
    SELECT 
      u.id,
      u.email,
      u.full_name,
      u.created_at,
      e.year as entry_year,
      e.updated_at as entry_updated_at,
      e.data as entry_data,
      r.frequency as reminder_frequency,
      r.day_of_week as reminder_day,
      r.last_sent_at as last_reminder_sent
    FROM journal_users u
    LEFT JOIN journal_entries e ON u.id = e.user_id AND e.year = ?
    LEFT JOIN journal_email_reminders r ON u.id = r.user_id
  `;

  const args: any[] = [year];

  if (search && search.trim()) {
    query += ` WHERE (LOWER(u.email) LIKE ? OR LOWER(u.full_name) LIKE ?)`;
    const s = `%${search.trim().toLowerCase()}%`;
    args.push(s, s);
  }

  query += ` ORDER BY COALESCE(e.updated_at, u.created_at) DESC`;

  const result = await db.execute({ sql: query, args });

  const members: AdminJournalMember[] = [];

  for (const row of result.rows as any[]) {
    const allGoals: AdminJournalGoalItem[] = [];
    const topThree: { area: string; text: string }[] = [];
    let hasGoals = false;

    if (row.entry_data) {
      try {
        const parsed = JSON.parse(row.entry_data);
        const goalsObj = parsed.goals || {};

        for (const [area, goal] of Object.entries(goalsObj) as [string, any][]) {
          if (goal && typeof goal.text === "string" && goal.text.trim().length > 0) {
            hasGoals = true;
            const item: AdminJournalGoalItem = {
              area,
              text: goal.text.trim(),
              isTopThree: !!goal.isTopThree,
              whyItMatters: goal.whyItMatters || "",
              supportNeeded: goal.supportNeeded || "",
              milestones: goal.milestones || {},
            };
            allGoals.push(item);
            if (goal.isTopThree) {
              topThree.push({ area, text: goal.text.trim() });
            }
          }
        }

        // If user didn't explicitly flag top 3, take first 3 set goals
        if (topThree.length === 0 && allGoals.length > 0) {
          allGoals.slice(0, 3).forEach((g) => {
            topThree.push({ area: g.area, text: g.text });
          });
        }
      } catch (err) {
        console.error("Error parsing journal entry for admin:", err);
      }
    }

    const reminderFreq = row.reminder_frequency || "disabled";

    // In-memory filter if specified
    if (filter === "with-goals" && !hasGoals) continue;
    if (filter === "no-goals" && hasGoals) continue;
    if (filter === "reminders-active" && reminderFreq === "disabled") continue;

    members.push({
      id: Number(row.id),
      email: String(row.email),
      full_name: String(row.full_name),
      created_at: String(row.created_at),
      entry_year: row.entry_year ? Number(row.entry_year) : undefined,
      entry_updated_at: row.entry_updated_at ? String(row.entry_updated_at) : undefined,
      has_goals: hasGoals,
      total_goals_count: allGoals.length,
      top_three_goals: topThree,
      all_goals: allGoals,
      reminder_frequency: reminderFreq,
      reminder_day: row.reminder_day ? String(row.reminder_day) : undefined,
      last_reminder_sent: row.last_reminder_sent ? String(row.last_reminder_sent) : undefined,
    });
  }

  return members;
}

export async function getJournalAdminStats(year: number = new Date().getFullYear()): Promise<JournalAdminStats> {
  await initDb();

  const totalUsersRes = await db.execute("SELECT COUNT(*) as count FROM journal_users");
  const totalUsers = Number(totalUsersRes.rows[0]?.count || 0);

  const remindersRes = await db.execute(
    "SELECT COUNT(*) as count FROM journal_email_reminders WHERE frequency != 'disabled'"
  );
  const usersWithReminders = Number(remindersRes.rows[0]?.count || 0);

  const allMembers = await getAdminJournalMembers(year);
  const usersWithGoals = allMembers.filter((m) => m.has_goals).length;

  return {
    totalUsers,
    usersWithGoals,
    usersWithReminders,
  };
}


