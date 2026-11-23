import { getUserFromRequest } from "@/lib/auth";
import { getJournalReminder, saveJournalReminder, isJournalUserPro } from "@/lib/db";
import { handleOptions, jsonResponse } from "@/lib/cors";

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request: Request) {
  try {
    const auth = getUserFromRequest(request);
    if (!auth) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const reminder = await getJournalReminder(auth.userId);
    return jsonResponse({
      reminder: reminder || {
        frequency: "weekly",
        day_of_week: "Monday",
        time_of_day: "08:00",
        email: auth.email,
        enabled: true,
      },
    });
  } catch (error) {
    console.error("Error fetching reminders:", error);
    return jsonResponse({ error: "Failed to fetch reminder settings" }, 500);
  }
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
          error: "Automated Email Reminders requires an active FRA Journal Pro subscription.",
          requires_pro: true,
        },
        403
      );
    }

    const body = await request.json();
    const { frequency, day_of_week, time_of_day, email } = body;

    const targetEmail = (email || auth.email).toLowerCase().trim();
    const targetFreq = frequency || "weekly";
    const targetDay = day_of_week || "Monday";
    const targetTime = time_of_day || "08:00";

    await saveJournalReminder(
      auth.userId,
      targetEmail,
      targetFreq,
      targetDay,
      targetTime
    );

    return jsonResponse({
      success: true,
      message: "Reminder settings updated successfully",
      reminder: {
        frequency: targetFreq,
        day_of_week: targetDay,
        time_of_day: targetTime,
        email: targetEmail,
      },
    });
  } catch (error) {
    console.error("Error saving reminder:", error);
    return jsonResponse({ error: "Failed to save reminder settings" }, 500);
  }
}
