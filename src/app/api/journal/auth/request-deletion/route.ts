import {
  getJournalUserByEmail,
  deleteJournalUserAccount,
  createJournalDeletionRequest,
} from "@/lib/db";
import { verifyPassword } from "@/lib/auth";
import { handleOptions, jsonResponse } from "@/lib/cors";

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, password, reason } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return jsonResponse({ error: "A valid email address is required." }, 400);
    }

    const cleanEmail = email.toLowerCase().trim();
    const clientIp =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const user = await getJournalUserByEmail(cleanEmail);

    // If the user provided their password, verify and perform immediate deletion
    if (password && typeof password === "string" && password.length > 0) {
      if (!user) {
        return jsonResponse(
          { error: "No account found matching this email address." },
          404
        );
      }

      const isPasswordValid = verifyPassword(password, user.password_hash, user.salt);
      if (!isPasswordValid) {
        return jsonResponse(
          {
            error:
              "Incorrect password. If you forgot your password, submit without entering a password, and our compliance team will process your request within 24-48 hours.",
          },
          401
        );
      }

      // Valid password -> instant permanent wipe of account and all cloud data
      await deleteJournalUserAccount(user.id);
      await createJournalDeletionRequest({
        email: cleanEmail,
        userId: user.id,
        reason: reason || "User submitted immediate deletion with verified password via web form",
        status: "completed",
        ipAddress: clientIp,
      });

      return jsonResponse({
        success: true,
        immediate: true,
        message:
          "Your account, goals, reflections, and all associated cloud data have been permanently deleted from our servers.",
      });
    }

    // If password was NOT provided (user forgot password or uninstalled app):
    // Register deletion request for automated/compliance queue
    if (user) {
      await createJournalDeletionRequest({
        email: cleanEmail,
        userId: user.id,
        reason: reason || "Web deletion request submitted without password",
        status: "pending",
        ipAddress: clientIp,
      });
    } else {
      // Record request for tracking even if no user found
      await createJournalDeletionRequest({
        email: cleanEmail,
        userId: null,
        reason: reason || "Web deletion request for unindexed or already deleted email",
        status: "completed",
        ipAddress: clientIp,
      });
    }

    return jsonResponse({
      success: true,
      immediate: false,
      message:
        "Your account and data deletion request has been successfully received. All profile details, goals, reflections, and scheduled reminders associated with this email will be permanently wiped within 24 to 48 hours.",
    });
  } catch (error) {
    console.error("Error in request-deletion route:", error);
    return jsonResponse(
      { error: "Failed to process deletion request. Please contact fajostech@gmail.com directly." },
      500
    );
  }
}
