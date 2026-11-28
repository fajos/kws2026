import { NextResponse } from "next/server";
import { upsertJournalSubscription } from "@/lib/db";
import { handleOptions, jsonResponse } from "@/lib/cors";

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return jsonResponse({ error: "Transaction reference is required." }, 400);
    }

    const paystackSecret = (process.env.PAYSTACK_SECRET_KEY || "").trim();
    if (!paystackSecret) {
      return jsonResponse({ error: "Paystack secret key is missing on server." }, 500);
    }

    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
        },
      }
    );

    const verifyData = await verifyRes.json();

    if (!verifyRes.ok || !verifyData.status || verifyData.data?.status !== "success") {
      return jsonResponse(
        {
          success: false,
          error:
            verifyData.message ||
            "Payment verification failed or payment was not successful.",
        },
        400
      );
    }

    const data = verifyData.data;
    const userId = Number(data.metadata?.user_id);
    const email = data.metadata?.email || data.customer?.email;

    // Set 1 year validity from today
    const currentPeriodEnd = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

    if (userId) {
      await upsertJournalSubscription({
        user_id: userId,
        status: "active",
        tier: "pro",
        platform: "paystack_web",
        original_transaction_id: String(data.id || reference),
        current_period_end: currentPeriodEnd,
        cancel_at_period_end: false,
      });
    }

    return jsonResponse({
      success: true,
      is_pro: true,
      amount: data.amount,
      customer_email: email,
      message: "Payment successfully verified! FRA Journal Pro is now active.",
    });
  } catch (error) {
    console.error("Paystack verification error:", error);
    return jsonResponse({ error: "Failed to verify Paystack payment." }, 500);
  }
}
