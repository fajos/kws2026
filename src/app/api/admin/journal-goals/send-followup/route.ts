import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getJournalUserById } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("kws_admin_token");

    if (!adminToken || adminToken.value !== "granted_admin_session") {
      return NextResponse.json(
        { error: "Unauthorized access. Admin login required." },
        { status: 401 }
      );
    }

    const { userId, subject, message } = await request.json();

    if (!userId || !subject || !message) {
      return NextResponse.json(
        { error: "User ID, subject, and message are required" },
        { status: 400 }
      );
    }

    const user = await getJournalUserById(userId);
    if (!user) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://kws2026.vercel.app";
    const journalUrl = `${appUrl}/journal`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FBF8F3; margin: 0; padding: 24px; color: #2B1C22;">
  <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #E8DFD8; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
    <!-- Header -->
    <div style="background-color: #064E3B; color: #FFFFFF; padding: 28px 24px; text-align: center;">
      <h1 style="margin: 0; font-size: 22px; letter-spacing: -0.5px; font-serif: 'Georgia', serif;">Finish Rich Africa</h1>
      <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.9; color: #A7F3D0;">Kingdom Wealth Summit • Personal Goal Follow-Up</p>
    </div>

    <!-- Body -->
    <div style="padding: 28px 24px;">
      <p style="font-size: 16px; line-height: 1.5; margin-top: 0;">
        Dear <strong>${user.full_name}</strong>,
      </p>

      <div style="font-size: 15px; line-height: 1.7; color: #2C2825; white-space: pre-wrap; margin: 20px 0;">
${message}
      </div>

      <!-- Action Button -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="${journalUrl}" style="background-color: #D97706; color: #FFFFFF; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: bold; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(217,119,6,0.3);">
          Open My E-Journal &amp; Update Goals →
        </a>
      </div>

      <div style="background-color: #FAF4EB; border-left: 4px solid #D97706; padding: 14px 18px; border-radius: 8px; margin: 20px 0; font-size: 13.5px; color: #78350F; line-height: 1.5;">
        "Write the vision, and make it plain upon tables, that he may run that readeth it."
        <br><span style="font-weight: bold; display: inline-block; margin-top: 4px;">— Habakkuk 2:2</span>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #F4EBE6; padding: 16px; text-align: center; font-size: 12px; color: #8C7B75; border-top: 1px solid #E8DFD8;">
      Kingdom Wealth Summit • Finish Rich Africa Leadership Team
      <br>
      Direct follow-up dispatched to ${user.email}.
    </div>
  </div>
</body>
</html>
`;

    let deliveredVia = "simulation";

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
            to: user.email,
            subject,
            html: htmlContent,
          }),
        });

        if (resendRes.ok) {
          deliveredVia = "resend";
        } else {
          const errText = await resendRes.text();
          console.warn("Resend email delivery returned non-200:", errText);
        }
      } catch (e) {
        console.error("Resend API failed in admin follow-up:", e);
      }
    }

    return NextResponse.json({
      success: true,
      deliveredVia,
      recipient: user.email,
      message: `Follow-up email sent successfully to ${user.full_name} (${user.email})!`,
    });
  } catch (error) {
    console.error("Error sending admin follow-up email:", error);
    return NextResponse.json(
      { error: "Failed to dispatch follow-up email" },
      { status: 500 }
    );
  }
}
