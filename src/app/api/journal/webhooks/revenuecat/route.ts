import { upsertJournalSubscription, getJournalUserById, getJournalUserByEmail } from "@/lib/db";
import { handleOptions, jsonResponse } from "@/lib/cors";

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(request: Request) {
  try {
    // 1. Verify Authorization Header (if configured)
    const expectedSecret = process.env.REVENUECAT_WEBHOOK_SECRET;
    if (expectedSecret) {
      const authHeader = request.headers.get("authorization");
      const normalizedHeader = authHeader?.replace(/^Bearer\s+/i, "").trim();
      if (normalizedHeader !== expectedSecret.trim()) {
        console.warn("[RevenueCat Webhook] Unauthorized request attempt.");
        return jsonResponse({ error: "Unauthorized" }, 401);
      }
    }

    const payload = await request.json();
    const event = payload?.event;

    if (!event) {
      return jsonResponse({ error: "Missing event payload" }, 400);
    }

    const eventType: string = event.type || "";
    const appUserIdStr: string = event.app_user_id || event.original_app_user_id || "";
    const productId: string = event.product_id || "";
    const store: string = event.store || "";
    const expirationAtMs: number | undefined = event.expiration_at_ms;
    const periodType: string = event.period_type || "NORMAL";
    const originalTransactionId: string = event.original_transaction_id || event.transaction_id || "";

    console.log(`[RevenueCat Webhook] Received ${eventType} for app_user_id: ${appUserIdStr}, product: ${productId}, store: ${store}`);

    // Resolve user ID
    let userId: number | null = null;
    const parsedId = parseInt(appUserIdStr, 10);
    if (!isNaN(parsedId) && parsedId > 0) {
      const existingUser = await getJournalUserById(parsedId);
      if (existingUser) {
        userId = existingUser.id;
      }
    }

    // If app_user_id was formatted as an email
    if (!userId && appUserIdStr.includes("@")) {
      const userByEmail = await getJournalUserByEmail(appUserIdStr);
      if (userByEmail) {
        userId = userByEmail.id;
      }
    }

    if (!userId) {
      console.warn(`[RevenueCat Webhook] Could not resolve journal user for app_user_id: "${appUserIdStr}". Ignoring or recording.`);
      return jsonResponse({
        received: true,
        warning: `User "${appUserIdStr}" not linked to an active journal user.`,
      });
    }

    // Map store to platform
    let platform = "unknown";
    if (store === "APP_STORE" || store === "MAC_APP_STORE") {
      platform = "apple_iap";
    } else if (store === "PLAY_STORE") {
      platform = "google_play";
    } else if (store === "STRIPE") {
      platform = "stripe";
    } else if (store === "PROMOTIONAL") {
      platform = "promo";
    } else if (store) {
      platform = store.toLowerCase();
    }

    // Map tier
    let tier = "pro";
    if (productId.toLowerCase().includes("annual") || productId.toLowerCase().includes("year")) {
      tier = "annual";
    } else if (productId.toLowerCase().includes("monthly") || productId.toLowerCase().includes("month")) {
      tier = "monthly";
    } else if (productId.toLowerCase().includes("lifetime")) {
      tier = "lifetime";
    }

    // Map status
    let status: "active" | "trialing" | "canceled" | "expired" | "past_due" | "free" = "active";
    let cancelAtPeriodEnd = false;

    switch (eventType) {
      case "INITIAL_PURCHASE":
      case "RENEWAL":
      case "UNCANCELLATION":
      case "PRODUCT_CHANGE":
      case "NON_RENEWING_PURCHASE":
        status = periodType === "TRIAL" ? "trialing" : "active";
        cancelAtPeriodEnd = false;
        break;

      case "CANCELLATION":
        status = "canceled";
        cancelAtPeriodEnd = true;
        break;

      case "EXPIRATION":
        status = "expired";
        cancelAtPeriodEnd = false;
        break;

      case "BILLING_ISSUE":
        status = "past_due";
        break;

      case "TEST":
        console.log("[RevenueCat Webhook] Test event successfully verified.");
        return jsonResponse({ received: true, message: "Test event received" });

      default:
        console.log(`[RevenueCat Webhook] Unhandled event type: ${eventType}`);
        return jsonResponse({ received: true, message: `Ignored event: ${eventType}` });
    }

    const currentPeriodEnd = expirationAtMs ? new Date(expirationAtMs).toISOString() : undefined;

    await upsertJournalSubscription({
      user_id: userId,
      status,
      tier,
      platform,
      original_transaction_id: originalTransactionId,
      current_period_end: currentPeriodEnd,
      cancel_at_period_end: cancelAtPeriodEnd,
    });

    console.log(`[RevenueCat Webhook] Successfully updated user ${userId} subscription to ${status} (${tier}, ${platform})`);

    return jsonResponse({
      received: true,
      user_id: userId,
      status,
      tier,
    });
  } catch (error) {
    console.error("[RevenueCat Webhook Error]:", error);
    return jsonResponse({ error: "Internal webhook processing error" }, 500);
  }
}
