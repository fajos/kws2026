import {
  getActiveReminders,
  getJournalEntry,
  getJournalUserById,
  isJournalUserPro,
  updateReminderLastSent,
} from "@/lib/db";
import { jsonResponse } from "@/lib/cors";

export const dynamic = "force-dynamic";

/**
 * Automated Cron Job for Journal Email Reminders.
 * Invoked by Vercel Cron or an external scheduler.
 * Vercel Crons send a GET request with `Authorization: Bearer <CRON_SECRET>`.
 */
async function processRemindersCron(request: Request) {
  try {
    // 1. Authorization check for CRON_SECRET if configured
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret) {
      const authHeader = request.headers.get("Authorization");
      const url = new URL(request.url);
      const queryKey = url.searchParams.get("key");

      const isAuthorized =
        authHeader === `Bearer ${cronSecret}` || queryKey === cronSecret;

      if (!isAuthorized) {
        return jsonResponse({ error: "Unauthorized cron invocation" }, 401);
      }
    }

    const reminders = await getActiveReminders();
    const now = new Date();
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const todayName = dayNames[now.getUTCDay()];
    const dayOfMonth = now.getUTCDate();
    const currentYear = now.getUTCFullYear();

    const results: Array<{
      userId: number;
      email: string;
      frequency: string;
      status: "sent" | "skipped_not_pro" | "skipped_not_due" | "error";
      reason?: string;
    }> = [];

    for (const r of reminders) {
      // 2. Strict Pro Gating: Only active Pro members receive automated email reminders
      const isPro = await isJournalUserPro(r.user_id, r.email);
      if (!isPro) {
        results.push({
          userId: r.user_id,
          email: r.email,
          frequency: r.frequency,
          status: "skipped_not_pro",
          reason: "User is on free plan",
        });
        continue;
      }

      // 3. Cadence Evaluation
      let isDue = false;
      const lastSentTime = r.last_sent_at
        ? new Date(r.last_sent_at).getTime()
        : 0;
      const hoursSinceLastSent = lastSentTime
        ? (now.getTime() - lastSentTime) / (1000 * 60 * 60)
        : Infinity;

      if (r.frequency === "daily") {
        // Daily: Due once every ~20 hours
        isDue = hoursSinceLastSent >= 20;
      } else if (r.frequency === "weekly") {
        // Weekly: Due on user's preferred day (default Monday) if not sent within ~6 days
        const targetDay = (r.day_of_week || "Monday").trim().toLowerCase();
        const matchesDay = todayName.toLowerCase() === targetDay;
        isDue = matchesDay && hoursSinceLastSent >= 6 * 24;
      } else if (r.frequency === "monthly") {
        // Monthly: Due on 1st of month (or once every ~25 days)
        const isStartOfMonth = dayOfMonth === 1;
        isDue = (isStartOfMonth || hoursSinceLastSent >= 28 * 24) && hoursSinceLastSent >= 25 * 24;
      }

      if (!isDue) {
        results.push({
          userId: r.user_id,
          email: r.email,
          frequency: r.frequency,
          status: "skipped_not_due",
          reason: `Not due today (${todayName}, day ${dayOfMonth}, hours since last: ${Math.round(hoursSinceLastSent)})`,
        });
        continue;
      }

      // 4. Retrieve User Profile & Goals
      try {
        const user = await getJournalUserById(r.user_id);
        const userName = user?.full_name || "Fellow Achiever";

        const entry = await getJournalEntry(r.user_id, currentYear);
        let topGoals: { area: string; text: string; priority: number }[] = [];

        if (entry && entry.data) {
          try {
            const state = JSON.parse(entry.data);
            if (state.goals) {
              topGoals = Object.entries(state.goals)
                .map(([area, g]: any) => ({
                  area,
                  text: g.text || "",
                  priority: g.priority || 1,
                  isTopThree: Boolean(g.isTopThree),
                }))
                .filter((g) => g.text.trim().length > 0)
                .sort((a, b) => (b.isTopThree ? 1 : 0) - (a.isTopThree ? 1 : 0))
                .slice(0, 5);
            }
          } catch (e) {
            console.error("Error parsing goals for cron email:", e);
          }
        }

        const appUrl =
          process.env.NEXT_PUBLIC_APP_URL || "https://kws2026.vercel.app";
        const journalUrl = `${appUrl}/journal`;

        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your FRA Journal Goal Reminder</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FBF8F3; margin: 0; padding: 24px; color: #2B1C22;">
  <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #E8DFD8; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
    <!-- Header -->
    <div style="background-color: #7A283C; color: #FFFFFF; padding: 28px 24px; text-align: center;">
      <h1 style="margin: 0; font-size: 24px; letter-spacing: -0.5px; font-family: 'Georgia', serif;">FRA Journal</h1>
      <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.9; color: #FAD4DE;">${currentYear} Goal Reminder & Alignment Check</p>
    </div>

    <!-- Body -->
    <div style="padding: 28px 24px;">
      <p style="font-size: 16px; line-height: 1.5; margin-top: 0;">
        Hello <strong>${userName}</strong>,
      </p>
      <p style="font-size: 15px; line-height: 1.6; color: #583B43;">
        Here is your scheduled goal check-in. Steady daily momentum and reflective alignment turn your annual vision into reality.
      </p>

      <div style="background-color: #FAF4EB; border-left: 4px solid #7A283C; padding: 14px 18px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0; font-size: 15px; color: #7A283C; text-transform: uppercase; letter-spacing: 0.5px;">
          ★ Active Yearly Focus
        </h3>
        ${
          topGoals.length > 0
            ? `<ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                ${topGoals
                  .map(
                    (g) =>
                      `<li style="margin-bottom: 8px;"><strong>${g.area}:</strong> ${g.text}</li>`
                  )
                  .join("")}
              </ul>`
            : `<p style="margin: 0; font-size: 14px; color: #8C7B75; font-style: italic;">
                You haven't set any yearly goals yet for ${currentYear}. Tap the button below to write down your vision!
              </p>`
        }
      </div>

      <!-- Action Button -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="${journalUrl}" style="background-color: #7A283C; color: #FFFFFF; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: bold; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(122,40,60,0.3);">
          Open My Journal & Track Progress →
        </a>
      </div>

      <div style="background-color: #F8F5F2; padding: 16px; border-radius: 10px; font-size: 13.5px; color: #6E5F5A; line-height: 1.5; font-style: italic; border: 1px dashed #DDD2C9; text-align: center;">
        "It is not enough to be busy; so are the ants. The question is: What are we busy about?"
        <br><span style="font-weight: 600; font-style: normal; display: inline-block; margin-top: 4px;">— Henry David Thoreau</span>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #F4EBE6; padding: 16px; text-align: center; font-size: 12px; color: #8C7B75; border-top: 1px solid #E8DFD8;">
      Kingdom Wealth Summit 2026 • Finish Rich Africa
      <br>
      You received this because ${r.frequency} email goal reminders are enabled for ${r.email}.
    </div>
  </div>
</body>
</html>
`;

        // 5. Send Email via Resend
        if (process.env.RESEND_API_KEY) {
          try {
            await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
              },
              body: JSON.stringify({
                from:
                  process.env.EMAIL_FROM ||
                  "E-Journal <journal@finishrichafrica.com>",
                to: r.email,
                subject: `★ Your ${currentYear} Goal Check-In & Alignment Reminder`,
                html: htmlContent,
              }),
            });
          } catch (e) {
            console.error(`Failed to send email to ${r.email}:`, e);
          }
        }

        await updateReminderLastSent(r.user_id);

        results.push({
          userId: r.user_id,
          email: r.email,
          frequency: r.frequency,
          status: "sent",
        });
      } catch (err: any) {
        results.push({
          userId: r.user_id,
          email: r.email,
          frequency: r.frequency,
          status: "error",
          reason: err?.message || "Unknown error",
        });
      }
    }

    const sentCount = results.filter((x) => x.status === "sent").length;

    return jsonResponse({
      success: true,
      timestamp: now.toISOString(),
      today: todayName,
      totalActiveReminders: reminders.length,
      dispatchedCount: sentCount,
      results,
    });
  } catch (error: any) {
    console.error("Cron reminders error:", error);
    return jsonResponse(
      { error: "Failed to process reminder cron", details: error?.message },
      500
    );
  }
}

export async function GET(request: Request) {
  return processRemindersCron(request);
}

export async function POST(request: Request) {
  return processRemindersCron(request);
}
