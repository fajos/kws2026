import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Reflective E-Journal",
  description: "Privacy Policy for Reflective E-Journal by Fajostech & Kingdom Wealth Summit.",
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
              Reflective E-Journal (&ldquo;the App&rdquo;), developed by Fajostech, is designed to help you organize
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
            <h2 className="text-lg font-bold text-white mb-2">5. User Control & Account Deletion</h2>
            <p>
              In accordance with Apple App Store and Google Play requirements, you have full control over your data. You may
              permanently delete your account and all associated cloud entries at any time directly in the app under
              <strong> Settings &gt; Delete Account & Wipe Cloud Data</strong>, or by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or your personal data, please contact us at:
              <br />
              <strong className="text-emerald-400">support@fajostech.com</strong>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
