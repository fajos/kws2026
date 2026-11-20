import { db, initDb } from "./db";

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
  is_kws_attendee?: boolean;
  membership_tag?: string;
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
      r.last_sent_at as last_reminder_sent,
      CASE WHEN reg.id IS NOT NULL THEN 1 ELSE 0 END as is_kws_attendee
    FROM journal_users u
    LEFT JOIN journal_entries e ON u.id = e.user_id AND e.year = ?
    LEFT JOIN journal_email_reminders r ON u.id = r.user_id
    LEFT JOIN registrations reg ON LOWER(u.email) = LOWER(reg.email)
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
      is_kws_attendee: Boolean(row.is_kws_attendee),
      membership_tag: row.is_kws_attendee ? "Kingdom Wealth Summit Member" : "E-Journal Member",
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
