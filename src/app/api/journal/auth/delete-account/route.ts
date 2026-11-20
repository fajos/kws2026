import { getUserFromRequest } from "@/lib/auth";
import { getJournalUserById, deleteJournalUserAccount } from "@/lib/db";
import { handleOptions, jsonResponse } from "@/lib/cors";

export async function OPTIONS() {
  return handleOptions();
}

export async function DELETE(request: Request) {
  try {
    const auth = getUserFromRequest(request);
    if (!auth) {
      return jsonResponse({ error: "Unauthorized: Please log in to delete your account" }, 401);
    }

    const user = await getJournalUserById(auth.userId);
    if (!user) {
      return jsonResponse({ error: "Account not found or already deleted" }, 404);
    }

    // Permanently wipe all entries, reminders, and user record from database
    await deleteJournalUserAccount(auth.userId);

    const response = jsonResponse({
      success: true,
      message: "Your account and all associated journal data have been permanently deleted from our servers.",
    });

    // Clear session cookie
    response.cookies.delete("journal_token");
    return response;
  } catch (error) {
    console.error("Error in delete account route:", error);
    return jsonResponse({ error: "Failed to delete account. Please try again." }, 500);
  }
}
