import { getUserFromRequest } from "@/lib/auth";
import {
  getJournalUserById,
  getRegistrationByEmail,
  deleteJournalUserAccount,
  getJournalSubscription,
  isJournalUserPro,
} from "@/lib/db";
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

    const registration = await getRegistrationByEmail(user.email);
    const isKwsMember = !!registration;
    const membershipTag = isKwsMember ? "Kingdom Wealth Summit Member" : "E-Journal Member";

    // Subscription status
    const subscription = await getJournalSubscription(user.id);
    const isPro = await isJournalUserPro(user.id, user.email);

    return jsonResponse({
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        created_at: user.created_at,
        is_kws_member: isKwsMember,
        membership_tag: membershipTag,
        is_pro: isPro,
        subscription: subscription || null,
      },
    });
  } catch (error) {
    console.error("Error in auth me route:", error);
    return jsonResponse({ error: "Internal server error" }, 500);
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = getUserFromRequest(request);
    if (!auth) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const user = await getJournalUserById(auth.userId);
    if (!user) {
      return jsonResponse({ error: "User not found" }, 404);
    }

    await deleteJournalUserAccount(auth.userId);
    const response = jsonResponse({
      success: true,
      message: "Account and all associated data deleted successfully.",
    });
    response.cookies.delete("journal_token");
    return response;
  } catch (error) {
    console.error("Error in DELETE auth me route:", error);
    return jsonResponse({ error: "Internal server error" }, 500);
  }
}
