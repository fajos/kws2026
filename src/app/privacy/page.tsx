import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | FRA Journal",
  description: "Privacy Policy for FRA Journal by Finish Rich Africa (FRA) and Fajostech.",
};

export default function PrivacyPolicyPage() {
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
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Privacy Policy</h1>
          <p className="text-slate-400 text-sm mt-1">Effective Date: November 21, 2026</p>
        </div>

        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-2">1. Overview & Commitment</h2>
            <p>
              FRA Journal (&ldquo;the App&rdquo;), developed by Finish Rich Africa (FRA) and Fajostech, is designed to help you organize
              your yearly goals, milestones, reflections, and personal habits. We believe your thoughts, finances,
              and reflections are deeply personal. We do not sell your personal data or journal entries to any third party.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">2. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li>
                <strong className="text-slate-100">Account Information:</strong> When you register an account, we collect
                your name, email address, and an encrypted password hash to synchronize your journal data across devices.
              </li>
              <li>
                <strong className="text-slate-100">Journal Content:</strong> Your yearly targets, quarterly milestones,
                monthly reflections, and weekly plans are stored locally on your device and, if signed in, backed up securely
                to our encrypted cloud database.
              </li>
              <li>
                <strong className="text-slate-100">Biometric Data:</strong> If you enable Face ID, Touch ID, or Fingerprint
                unlock, authentication is processed exclusively by your device&rsquo;s native operating system (Apple Secure Enclave /
                Android BiometricPrompt). We never collect, transmit, or store your biometric data.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">3. Subscriptions & Payments</h2>
            <p>
              All purchases made through the iOS or Android mobile application are processed directly by Apple (App Store) or
              Google (Google Play). We do not collect or store your payment card numbers. We receive anonymous transaction identifiers
              from RevenueCat to verify your Pro entitlement across iOS, Android, and Web.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">4. Data Storage & Security</h2>
            <p>
              Your data is stored locally on your device via secure sandbox storage and backed up via encrypted HTTPS connections
              to our secure database infrastructure. All database communication uses industry-standard TLS encryption.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">5. User Control &amp; Account Deletion</h2>
            <p>
              In accordance with Apple App Store Guideline 5.1.1(v) and Google Play Data Safety policies, you have
              full control over your personal data. You may permanently delete your account and all associated cloud entries
              at any time through either of the following methods:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300 my-2">
              <li>
                <strong className="text-slate-100">In-App Immediate Deletion:</strong> In the mobile app, navigate to{" "}
                <strong>Settings &gt; Cloud Backup &amp; Account &gt; Delete Account &amp; Wipe Cloud Data</strong> to
                instantly erase your account and all cloud data.
              </li>
              <li>
                <strong className="text-slate-100">Web Deletion Request Portal:</strong> If you uninstalled the app or
                prefer web submission, submit a request at our dedicated deletion page:{" "}
                <Link
                  href="/delete-account"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold underline"
                >
                  https://kws2026.vercel.app/delete-account
                </Link>
                .
              </li>
            </ul>
            <p className="text-xs text-slate-400 mt-2">
              All journal entries, yearly targets, quarterly milestones, reflections, habits, and user credentials will be
              permanently purged from our database. No personal data is retained.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or your personal data, please contact us at:
              <br />
              Email:{" "}
              <a href="mailto:fajostech@gmail.com" className="text-emerald-400 hover:underline font-semibold">
                fajostech@gmail.com
              </a>
              <br />
              Website Support:{" "}
              <a
                href="https://fajostech.com/contact"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:underline font-semibold"
              >
                https://fajostech.com/contact
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
