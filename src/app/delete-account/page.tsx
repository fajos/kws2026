"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function DeleteAccountPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    immediate?: boolean;
    message?: string;
    error?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setResult({ error: "Please enter a valid registered email address." });
      return;
    }
    if (!confirmed) {
      setResult({
        error: "Please check the box to confirm that you understand this action is permanent.",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/journal/auth/request-deletion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password: password ? password : undefined,
          reason: reason.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setResult({
          error: data.error || "Failed to process request. Please contact support.",
        });
      } else {
        setResult({
          success: true,
          immediate: data.immediate,
          message: data.message,
        });
        setEmail("");
        setPassword("");
        setReason("");
        setConfirmed(false);
      }
    } catch {
      setResult({
        error:
          "Network error while submitting request. Please try again or email fajostech@gmail.com directly.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <Link
            href="/"
            className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold inline-flex items-center gap-1.5 mb-4 transition"
          >
            ← Back to FRA Journal Home
          </Link>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
              Data Safety &amp; Privacy
            </span>
            <span className="text-slate-400 text-xs">
              Google Play &amp; Apple App Store Policy Compliance
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            FRA Journal — Account &amp; Data Deletion Request
          </h1>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            In compliance with Google Play Data Safety policies and Apple App Store Guideline 5.1.1(v),
            you have full authority to request the permanent deletion of your FRA Journal account and all
            associated data stored on our servers.
          </p>
        </div>

        {/* Section: What Data is Deleted vs Retained */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              What Data is Deleted
            </h2>
            <p className="text-xs text-slate-400 mt-1 mb-3">
              When an account deletion request is processed, the following information is permanently erased:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-slate-300">
              <li>
                <strong className="text-slate-100">Account Credentials &amp; Profile:</strong> Full name,
                registered email address, cryptographic password hash, and security salt.
              </li>
              <li>
                <strong className="text-slate-100">Personal Journal Data:</strong> All yearly targets,
                quarterly milestones, monthly reflections, weekly actions, daily logs, habits, and Life Balance radar scores.
              </li>
              <li>
                <strong className="text-slate-100">Cloud Sync Backups:</strong> All encrypted copies of your
                journal entries stored on our cloud servers.
              </li>
              <li>
                <strong className="text-slate-100">Email Reminders:</strong> Cadence reminder configurations,
                delivery preferences, and scheduled notifications.
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              What Data is Retained
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              <strong className="text-white">None.</strong> Once account deletion is completed, all
              identifiable personal data, journal entries, and configurations are permanently erased
              from our database. We do not retain residual backups or sell your data.
            </p>
            <p className="text-xs text-slate-400 mt-2">
              <strong className="text-slate-300">Notice Regarding Active Subscriptions:</strong> If you have an
              active <em>FRA Journal Pro</em> subscription purchased via Apple App Store or Google Play,
              please cancel your subscription directly in your device&rsquo;s store settings (Apple ID &gt;
              Subscriptions or Google Play Store &gt; Subscriptions) to prevent automated renewal charges
              by Apple or Google. Subscriptions are billed directly by the platform store operators.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              Deletion Timeline
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-300 mt-2">
              <li>
                <strong className="text-slate-100">In-App Self-Service:</strong> Instantaneous and permanent
                (erased immediately upon confirmation).
              </li>
              <li>
                <strong className="text-slate-100">Web Form with Verified Password:</strong> Instantaneous.
              </li>
              <li>
                <strong className="text-slate-100">Web Request without Password / Email Request:</strong> Processed
                within <strong className="text-emerald-400">24 to 48 hours</strong> by our compliance team.
              </li>
            </ul>
          </div>
        </div>

        {/* Option 1: In-App Instructions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">
              Method 1: Instant In-App Deletion (Recommended)
            </h2>
            <span className="text-xs font-semibold px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Immediate
            </span>
          </div>
          <p className="text-sm text-slate-300 mb-4">
            If you still have the FRA Journal mobile application installed on your device, you can delete
            your account instantly without waiting:
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-300">
            <li>
              Open the <strong>FRA Journal</strong> app on your iOS or Android device.
            </li>
            <li>
              Tap the <strong>Settings</strong> gear icon in the top header.
            </li>
            <li>
              Scroll down to the <strong>Cloud Backup &amp; Account</strong> section.
            </li>
            <li>
              Tap the red <strong>Delete Account &amp; Wipe Cloud Data</strong> button.
            </li>
            <li>
              Confirm when prompted. Your account, credentials, and all cloud records will be purged immediately.
            </li>
          </ol>
        </div>

        {/* Option 2: Web Deletion Request Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">
              Method 2: Web Deletion Request Form
            </h2>
            <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
              Web Portal
            </span>
          </div>
          <p className="text-sm text-slate-300 mb-6">
            If you have uninstalled the app or prefer to request deletion via the web, submit your registered
            email address below.
          </p>

          {result?.success && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm">
              <div className="flex items-center gap-2 font-bold text-emerald-200 mb-1">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                {result.immediate ? "Account Deleted Successfully" : "Request Received"}
              </div>
              <p className="text-emerald-300/90 leading-relaxed">{result.message}</p>
            </div>
          )}

          {result?.error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
              <div className="flex items-center gap-2 font-bold text-red-200 mb-1">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Unable to Process Request
              </div>
              <p className="text-red-300/90 leading-relaxed">{result.error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Registered Account Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. name@example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Account Password <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  Provide for instant deletion
                </span>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank if you forgot your password"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
              />
              <p className="text-xs text-slate-400 mt-1">
                If provided and verified, your account and all data are deleted immediately. If left blank, our team will process the purge within 24-48 hours.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Reason for Leaving <span className="text-slate-500 font-normal">(Optional)</span>
              </label>
              <textarea
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Tell us how we could improve (optional)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition resize-none"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-xs text-slate-300 leading-relaxed">
                  I confirm that I am requesting the permanent deletion of my FRA Journal account and all associated
                  cloud data. I understand that all yearly goals, weekly plans, and reflections will be permanently
                  erased and cannot be recovered.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition shadow-lg shadow-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Processing Request...
                </>
              ) : (
                "Submit Deletion Request"
              )}
            </button>
          </form>
        </div>

        {/* Option 3: Direct Contact */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-2">Method 3: Direct Email Support</h2>
          <p className="text-sm text-slate-300 mb-4 leading-relaxed">
            You can also submit your request directly to our customer support team via email or web contact:
          </p>
          <div className="space-y-1.5 text-sm text-slate-300">
            <div>
              Email:{" "}
              <a
                href="mailto:fajostech@gmail.com?subject=FRA%20Journal%20-%20Account%20and%20Data%20Deletion%20Request"
                className="text-emerald-400 hover:underline font-semibold"
              >
                fajostech@gmail.com
              </a>
            </div>
            <div>
              Support Web Form:{" "}
              <a
                href="https://fajostech.com/contact"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:underline font-semibold"
              >
                https://fajostech.com/contact
              </a>
            </div>
            <div>
              Developer: <span className="text-slate-100 font-medium">Fajostech</span> &amp;{" "}
              <span className="text-slate-100 font-medium">Finish Rich Africa (FRA)</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
