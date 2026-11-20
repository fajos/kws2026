import { getUserFromRequest } from "@/lib/auth";
import { getJournalUserById } from "@/lib/db";
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

    const user = await getJournalUserById(auth.userId);
    if (!user) {
      return jsonResponse({ error: "User not found" }, 404);
    }

    return jsonResponse({
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error("Error in auth me route:", error);
    return jsonResponse({ error: "Internal server error" }, 500);
  }
}
