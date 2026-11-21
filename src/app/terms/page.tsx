import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use (EULA) | Reflective E-Journal",
  description: "Terms of Use and End User License Agreement for Reflective E-Journal.",
};

export default function TermsOfUsePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-xl">
        <div className="mb-8 border-b border-slate-800 pb-6">
          <Link
            href="/"
            className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold flex items-center gap-1 mb-4"
          >
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Terms of Use (EULA)</h1>
          <p className="text-slate-400 text-sm mt-1">Effective Date: November 21, 2026</p>
        </div>

        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-2">1. Agreement to Terms</h2>
            <p>
              By downloading, installing, or accessing Reflective E-Journal (&ldquo;the App&rdquo;), you agree to be bound
              by these Terms of Use and the standard Apple End User License Agreement (EULA) available at{" "}
              <a
                href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:underline"
              >
                Apple Standard EULA
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">2. Subscriptions & Billing</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li>
                <strong className="text-slate-100">Annual Pro Membership:</strong> Access to Pro features is available via an
                auto-renewing subscription billed at $6.99 per year (or local currency equivalent).
              </li>
              <li>
                <strong className="text-slate-100">Auto-Renewal:</strong> Subscriptions automatically renew unless auto-renew is
                turned off at least 24 hours prior to the end of the current billing period.
              </li>
              <li>
                <strong className="text-slate-100">Payment:</strong> Payment is charged to your Apple ID or Google Play account at
                confirmation of purchase.
              </li>
              <li>
                <strong className="text-slate-100">Cancellation & Management:</strong> You can manage or cancel your subscription
                at any time in your Apple ID or Google Play Account Settings.
              </li>
              <li>
                <strong className="text-slate-100">Cross-Platform Entitlement:</strong> When subscribed, your Pro status is
                associated with your account email and unlocks Pro features on iOS, Android, and Web.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">3. Pro Features Included</h2>
            <p>
              An active Pro subscription includes:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-300 mt-1">
              <li>Unlimited Intelligent AI Goal Decompositions and action planning.</li>
              <li>Real-time multi-device cloud synchronization across Web, iOS, and Android.</li>
              <li>Annual Keepsake printable PDF book generation.</li>
              <li>Automated Sunday planning and month-end review email check-ins.</li>
              <li>Biometric lock security and multi-year historical archives.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">4. User Responsibilities & Acceptable Use</h2>
            <p>
              You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur
              under your account. You agree not to reverse engineer or tamper with the security features of the App.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">5. Termination & Account Deletion</h2>
            <p>
              You may terminate this agreement at any time by deleting your account inside the App (Settings &gt; Delete Account)
              and cancelling any active store subscriptions through your Apple or Google account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">6. Contact & Support</h2>
            <p>
              For inquiries regarding these Terms or billing assistance, please contact:
              <br />
              <strong className="text-emerald-400">support@fajostech.com</strong>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
