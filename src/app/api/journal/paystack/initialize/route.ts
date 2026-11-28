import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { handleOptions, jsonResponse } from "@/lib/cors";

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(request: Request) {
  try {
    const auth = getUserFromRequest(request);
    if (!auth) {
      return jsonResponse(
        { error: "Authentication required. Please sign in to upgrade to Pro." },
        401
      );
    }

    const paystackSecret = (process.env.PAYSTACK_SECRET_KEY || "").trim();
    if (!paystackSecret) {
      return jsonResponse(
        {
          error:
            "Paystack payments are not yet configured on this server. Please set PAYSTACK_SECRET_KEY.",
          configured: false,
        },
        500
      );
    }

    // Default amount: ₦10,000 / year (1,000,000 kobo). Can be overridden via PAYSTACK_AMOUNT_KOBO.
    const amountKobo = process.env.PAYSTACK_AMOUNT_KOBO
      ? parseInt(process.env.PAYSTACK_AMOUNT_KOBO, 10)
      : 1000000; // ₦10,000 in kobo

    const origin =
      request.headers.get("origin") ||
      request.headers.get("referer") ||
      "https://kws2026.vercel.app";
    const baseUrl = origin.split("?")[0].replace(/\/$/, "");

    // Unique reference code
    const reference = `FRA-PRO-${auth.userId}-${Date.now()}`;

    const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${paystackSecret}`,
      },
      body: JSON.stringify({
        email: auth.email,
        amount: amountKobo,
        reference,
        callback_url: `${baseUrl}/journal?payment=verify`,
        metadata: {
          user_id: auth.userId,
          email: auth.email,
          purpose: "fra_journal_pro_annual",
          platform: "web",
          custom_fields: [
            {
              display_name: "Account Email",
              variable_name: "account_email",
              value: auth.email,
            },
            {
              display_name: "Membership Tier",
              variable_name: "tier",
              value: "FRA Journal Pro (Annual)",
            },
          ],
        },
      }),
    });

    const paystackData = await paystackRes.json();
    if (!paystackRes.ok || !paystackData.status) {
      return jsonResponse(
        { error: paystackData.message || "Failed to initialize Paystack transaction." },
        400
      );
    }

    return jsonResponse({
      success: true,
      authorization_url: paystackData.data.authorization_url,
      access_code: paystackData.data.access_code,
      reference: paystackData.data.reference,
    });
  } catch (error) {
    console.error("Paystack initialize error:", error);
    return jsonResponse(
      { error: "Internal server error initializing payment" },
      500
    );
  }
}
