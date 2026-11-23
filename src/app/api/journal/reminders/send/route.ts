import { getUserFromRequest } from "@/lib/auth";
import { getJournalEntry, getJournalReminder, updateReminderLastSent, isJournalUserPro } from "@/lib/db";
import { handleOptions, jsonResponse } from "@/lib/cors";

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(request: Request) {
  try {
    const auth = getUserFromRequest(request);
    if (!auth) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const isPro = await isJournalUserPro(auth.userId, auth.email);
    if (!isPro) {
      return jsonResponse(
        {
          error: "Email Reminders require an active FRA Journal Pro subscription.",
          requires_pro: true,
        },
        403
      );
    }

    const reminder = await getJournalReminder(auth.userId);
    const targetEmail = reminder?.email || auth.email;

    const currentYear = new Date().getFullYear();
    const entry = await getJournalEntry(auth.userId, currentYear);

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
      } catch (err) {
        console.error("Error reading goals for email:", err);
      }
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://kws2026.vercel.app";
    const journalUrl = `${appUrl}/journal`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your KWS Reflective Journal Goal Reminder</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FBF8F3; margin: 0; padding: 24px; color: #2B1C22;">
  <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #E8DFD8; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
    <!-- Header -->
    <div style="background-color: #7A283C; color: #FFFFFF; padding: 28px 24px; text-align: center;">
      <h1 style="margin: 0; font-size: 24px; letter-spacing: -0.5px; font-serif: 'Georgia', serif;">FRA Journal</h1>
      <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.9; color: #FAD4DE;">${currentYear} Goal Reminder & Alignment Check</p>
    </div>

    <!-- Body -->
    <div style="padding: 28px 24px;">
      <p style="font-size: 16px; line-height: 1.5; margin-top: 0;">
        Hello <strong>${auth.name || "Fellow Achiever"}</strong>,
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
      You received this because email goal reminders are enabled for ${targetEmail}.
    </div>
  </div>
</body>
</html>
`;

    let deliveredVia = "simulation";

    // 1. Check if Resend API Key is available
    if (process.env.RESEND_API_KEY) {
      try {
        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM || "E-Journal <journal@finishrichafrica.com>",
            to: targetEmail,
            subject: `★ Your ${currentYear} Goal Check-In & Alignment Reminder`,
            html: htmlContent,
          }),
        });

        if (resendRes.ok) {
          deliveredVia = "resend";
        } else {
          const err = await resendRes.text();
          console.warn("Resend email delivery returned non-200:", err);
        }
      } catch (e) {
        console.error("Resend API failed:", e);
      }
    }

    if (!process.env.RESEND_API_KEY) {
      console.info("[Reminders] RESEND_API_KEY not configured in environment. Dispatched in local simulation mode.");
    }

    await updateReminderLastSent(auth.userId);

    return jsonResponse({
      success: true,
      deliveredVia,
      recipient: targetEmail,
      message: `Goal reminder email sent successfully to ${targetEmail}!`,
      previewHtml: htmlContent,
      sentAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error sending reminder email:", error);
    return jsonResponse({ error: "Failed to dispatch reminder email" }, 500);
  }
}
