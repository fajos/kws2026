import { db, initDb } from "./db";

export interface AdminJournalGoalItem {
  area: string;
  text: string;
  isTopThree: boolean;
  priority?: number;
  isCustom?: boolean;
  whyItMatters?: string;
  supportNeeded?: string;
  milestones?: { q1?: string; q2?: string; q3?: string; q4?: string };
  quarterlyTargets?: {
    q1?: string[];
    q2?: string[];
    q3?: string[];
    q4?: string[];
  };
  monthlyGoals?: {
    monthIndex: number;
    monthName: string;
    keyGoals: string[];
    todos: string[];
  }[];
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
        // Look for goals in target year: either parsed.goals or parsed.yearsData?.[year]
        const goalsObj =
          (parsed.year === year && parsed.goals)
            ? parsed.goals
            : (parsed.yearsData?.[year] || parsed.goals || {});

        for (const [area, goal] of Object.entries(goalsObj) as [string, any][]) {
          if (!goal) continue;

          // Extract primary text
          let primaryText = typeof goal.text === "string" ? goal.text.trim() : "";

          // Extract quarterly targets (month 1, 2, 3 targets)
          const quarterlyTargets: { [q: string]: string[] } = {};
          let totalQuarterlyTargets = 0;
          if (goal.quarterPlans && typeof goal.quarterPlans === "object") {
            for (const qNum of [1, 2, 3, 4]) {
              const qPlan = goal.quarterPlans[qNum];
              if (qPlan) {
                const qItems: string[] = [];
                for (const mKey of ["month1", "month2", "month3"]) {
                  if (Array.isArray(qPlan[mKey])) {
                    qPlan[mKey].forEach((it: any) => {
                      if (it && typeof it.text === "string" && it.text.trim()) {
                        qItems.push(it.text.trim());
                      }
                    });
                  }
                }
                if (qItems.length > 0) {
                  quarterlyTargets[`q${qNum}`] = qItems;
                  totalQuarterlyTargets += qItems.length;
                }
              }
            }
          }

          // Extract monthly key goals & todos
          const monthlyGoals: { monthIndex: number; monthName: string; keyGoals: string[]; todos: string[] }[] = [];
          if (goal.monthPlans && typeof goal.monthPlans === "object") {
            for (let m = 1; m <= 12; m++) {
              const mPlan = goal.monthPlans[m];
              if (mPlan) {
                const kGoals: string[] = [];
                const todos: string[] = [];
                if (Array.isArray(mPlan.keyGoals)) {
                  mPlan.keyGoals.forEach((it: any) => {
                    if (it && typeof it.text === "string" && it.text.trim()) {
                      kGoals.push(it.text.trim());
                    }
                  });
                }
                if (Array.isArray(mPlan.todos)) {
                  mPlan.todos.forEach((it: any) => {
                    if (it && typeof it.text === "string" && it.text.trim()) {
                      todos.push(it.text.trim());
                    }
                  });
                }
                if (kGoals.length > 0 || todos.length > 0) {
                  monthlyGoals.push({
                    monthIndex: m,
                    monthName: mPlan.monthName || `Month ${m}`,
                    keyGoals: kGoals,
                    todos,
                  });
                }
              }
            }
          }

          const hasMilestones = Boolean(
            goal.milestones &&
              (goal.milestones.q1?.trim() ||
                goal.milestones.q2?.trim() ||
                goal.milestones.q3?.trim() ||
                goal.milestones.q4?.trim())
          );
          const hasWhyOrSupport = Boolean(goal.whyItMatters?.trim() || goal.supportNeeded?.trim());
          const isExplicitCustom = Boolean(goal.isCustom);

          // If primary text is empty but user added milestones or targets, synthesize a meaningful summary
          if (!primaryText) {
            if (goal.milestones?.q1?.trim()) {
              primaryText = goal.milestones.q1.trim();
            } else if (quarterlyTargets.q1 && quarterlyTargets.q1.length > 0) {
              primaryText = quarterlyTargets.q1[0];
            } else if (monthlyGoals.length > 0 && monthlyGoals[0].keyGoals.length > 0) {
              primaryText = monthlyGoals[0].keyGoals[0];
            } else if (isExplicitCustom) {
              primaryText = `${area} (Custom focus area)`;
            } else if (hasWhyOrSupport) {
              primaryText = goal.whyItMatters?.trim() || `[${area}] Focus area set`;
            }
          }

          // A goal counts if primaryText exists, or it has milestones, quarterly targets, monthly goals, or is a custom goal
          if (
            primaryText ||
            isExplicitCustom ||
            hasMilestones ||
            totalQuarterlyTargets > 0 ||
            monthlyGoals.length > 0
          ) {
            hasGoals = true;
            const item: AdminJournalGoalItem = {
              area,
              text: primaryText || `[${area}] Focus area set`,
              isTopThree: !!goal.isTopThree,
              priority: goal.priority || 2,
              isCustom: isExplicitCustom,
              whyItMatters: goal.whyItMatters || "",
              supportNeeded: goal.supportNeeded || "",
              milestones: goal.milestones || {},
              quarterlyTargets: Object.keys(quarterlyTargets).length > 0 ? quarterlyTargets : undefined,
              monthlyGoals: monthlyGoals.length > 0 ? monthlyGoals : undefined,
            };
            allGoals.push(item);
            if (goal.isTopThree) {
              topThree.push({ area, text: item.text });
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
