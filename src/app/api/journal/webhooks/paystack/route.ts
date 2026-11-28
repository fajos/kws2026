import { NextResponse } from "next/server";
import crypto from "crypto";
import { upsertJournalSubscription } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const signature =
      request.headers.get("x-paystack-signature") ||
      request.headers.get("paystack-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing Paystack signature header." },
        { status: 400 }
      );
    }

    const secretCandidates = [
      process.env.PAYSTACK_WEBHOOK_SECRET,
      process.env.PAYSTACK_SECRET_KEY,
    ]
      .filter(Boolean)
      .map((s) => s!.trim());

    if (secretCandidates.length === 0) {
      return NextResponse.json(
        { error: "Paystack webhook signing secret or key is not configured on server." },
        { status: 500 }
      );
    }

    const bodyText = await request.text();

    let isValid = false;
    for (const secret of secretCandidates) {
      const hash = crypto
        .createHmac("sha512", secret)
        .update(bodyText)
        .digest("hex");
      if (hash === signature) {
        isValid = true;
        break;
      }
    }

    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
    }

    const payload = JSON.parse(bodyText);
    const event = payload.event;
    const data = payload.data;

    if (event === "charge.success") {
      const userId = Number(data?.metadata?.user_id);
      const reference = data?.reference || data?.id;

      if (userId) {
        const currentPeriodEnd = new Date(
          Date.now() + 365 * 24 * 60 * 60 * 1000
        ).toISOString();
        await upsertJournalSubscription({
          user_id: userId,
          status: "active",
          tier: "pro",
          platform: "paystack_web",
          original_transaction_id: String(reference),
          current_period_end: currentPeriodEnd,
          cancel_at_period_end: false,
        });
        console.log(
          `[Paystack Webhook] Activated Pro for user ${userId} (ref: ${reference})`
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Paystack webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
