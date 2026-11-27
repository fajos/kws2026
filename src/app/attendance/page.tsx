"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  CheckCircle2,
  AlertCircle,
  Search,
  UserCheck,
  UserPlus,
  ArrowRight,
  Clock,
  Sparkles,
  BookOpen,
  MapPin,
  Globe2,
  RefreshCw,
  Phone,
  Mail,
  User,
  ShieldCheck,
} from "lucide-react";

interface RegistrationRecord {
  id: number;
  reference_code: string;
  full_name: string;
  email: string;
  phone: string;
  attendance_type: "in-person" | "virtual";
  attended?: number | boolean;
  checked_in_at?: string;
  checkin_method?: string;
}

export default function AttendancePage() {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Success states
  const [matchedRecord, setMatchedRecord] = useState<RegistrationRecord | null>(null);
  const [alreadyCheckedIn, setAlreadyCheckedIn] = useState(false);
  const [justCheckedIn, setJustCheckedIn] = useState(false);

  // Walk-in form states (if email/phone not found)
  const [showWalkinForm, setShowWalkinForm] = useState(false);
  const [walkinName, setWalkinName] = useState("");
  const [walkinEmail, setWalkinEmail] = useState("");
  const [walkinPhone, setWalkinPhone] = useState("");
  const [walkinType, setWalkinType] = useState<"in-person" | "virtual">("in-person");
  const [walkinLoading, setWalkinLoading] = useState(false);

  // Usher auto-reset mode
  const [usherMode, setUsherMode] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Usher mode auto-reset countdown
  useEffect(() => {
    if (!usherMode || !matchedRecord || countdown === null) return;
    if (countdown <= 0) {
      handleReset();
      return;
    }
    const timer = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearTimeout(timer);
  }, [usherMode, matchedRecord, countdown]);

  async function handleCheckIn(e: React.FormEvent) {
    e.preventDefault();
    const clean = identifier.trim();
    if (!clean) {
      setError("Please enter your email address or phone number.");
      return;
    }

    setLoading(true);
    setError(null);
    setShowWalkinForm(false);
    setMatchedRecord(null);

    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: clean,
          action: "checkin",
          method: "self",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.notFound) {
          // Prefill walk-in form based on whether input looks like an email or phone
          if (clean.includes("@")) {
            setWalkinEmail(clean);
            setWalkinPhone("");
          } else {
            setWalkinPhone(clean);
            setWalkinEmail("");
          }
          setWalkinName("");
          setShowWalkinForm(true);
          setError(
            `No prior registration found for "${clean}". Don't worry! Complete your quick check-in below to enter immediately.`
          );
        } else {
          setError(data.error || "Unable to check in. Please try again.");
        }
        setLoading(false);
        return;
      }

      setMatchedRecord(data.registration);
      setAlreadyCheckedIn(Boolean(data.alreadyCheckedIn));
      setJustCheckedIn(!data.alreadyCheckedIn);

      if (usherMode) {
        setCountdown(8);
      }
    } catch {
      setError("Network error. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleWalkinSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!walkinName.trim()) {
      setError("Full name is required.");
      return;
    }
    if (!walkinEmail.trim() || !walkinEmail.includes("@")) {
      setError("A valid email address is required.");
      return;
    }
    if (!walkinPhone.trim()) {
      setError("Phone number is required.");
      return;
    }

    setWalkinLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/attendance/walkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: walkinName.trim(),
          email: walkinEmail.trim().toLowerCase(),
          phone: walkinPhone.trim(),
          attendance_type: walkinType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to record walk-in check-in.");
        setWalkinLoading(false);
        return;
      }

      setMatchedRecord(data.registration);
      setAlreadyCheckedIn(false);
      setJustCheckedIn(true);
      setShowWalkinForm(false);

      if (usherMode) {
        setCountdown(8);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setWalkinLoading(false);
    }
  }

  function handleReset() {
    setIdentifier("");
    setError(null);
    setMatchedRecord(null);
    setShowWalkinForm(false);
    setCountdown(null);
    setAlreadyCheckedIn(false);
    setJustCheckedIn(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }

  return (
    <div className="min-h-screen bg-emerald-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-emerald-950">
      <Navbar />

      <main className="flex-1 relative overflow-hidden py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-amber-400/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-xl mx-auto relative z-10 space-y-6">
          {/* Header Banner */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-900/90 border border-amber-400/40 text-amber-300 text-xs font-bold tracking-wider uppercase shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>KWS 2026 Event Attendance</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase drop-shadow-md">
              Summit Check-In
            </h1>
            <p className="text-emerald-200 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              Welcome to <strong>Kingdom Wealth Summit 2026</strong>. No reference code needed—simply enter your email or phone number to confirm your attendance.
            </p>

            {/* Event Day Details Badge */}
            <div className="inline-flex items-center gap-3 text-[11px] font-semibold text-emerald-300 bg-emerald-900/40 px-3.5 py-1.5 rounded-xl border border-emerald-800">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>The Philippi Centre, Ikeja &amp; Online</span>
              </span>
              <span className="text-emerald-600">•</span>
              <span className="text-amber-300 font-bold">28th Nov 2026</span>
            </div>
          </div>

          {/* MAIN CHECK-IN CARD */}
          {!matchedRecord ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-emerald-900/80 border border-emerald-700/80 shadow-2xl space-y-6 backdrop-blur-xl">
              {/* Lookup Form */}
              <form onSubmit={handleCheckIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
                    Enter Your Email or Phone Number
                  </label>
                  <div className="relative">
                    <Search className="w-5 h-5 text-emerald-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={identifier}
                      onChange={(e) => {
                        setIdentifier(e.target.value);
                        if (error && !showWalkinForm) setError(null);
                      }}
                      placeholder="e.g. name@email.com or 08012345678"
                      className="w-full bg-emerald-950 border-2 border-emerald-700 focus:border-amber-400 rounded-2xl py-3.5 pl-12 pr-4 text-sm sm:text-base text-white placeholder-emerald-600 focus:outline-none transition-all shadow-inner"
                    />
                  </div>
                  <p className="text-[11px] text-emerald-300/80 mt-1.5 pl-1">
                    Enter the email or phone number you used during registration.
                  </p>
                </div>

                {error && !showWalkinForm && (
                  <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div className="leading-relaxed">{error}</div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !identifier.trim()}
                  className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider text-emerald-950 btn-gold-3d flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-emerald-950 border-t-transparent rounded-full animate-spin" />
                      <span>Verifying Registration...</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-5 h-5 text-emerald-950" />
                      <span>Confirm My Attendance</span>
                    </>
                  )}
                </button>
              </form>

              {/* WALK-IN ON-THE-SPOT REGISTRATION FORM */}
              {showWalkinForm && (
                <div className="pt-6 border-t border-emerald-800/80 space-y-4 animate-fadeIn">
                  <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-200 text-xs space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-amber-300">
                      <UserPlus className="w-4 h-4" />
                      <span>Instant Walk-In Registration</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-amber-200/90">
                      Haven&apos;t registered yet? Fill in your name and details below to register and check in immediately.
                    </p>
                  </div>

                  <form onSubmit={handleWalkinSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-emerald-300 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={walkinName}
                          onChange={(e) => setWalkinName(e.target.value)}
                          placeholder="e.g. John Doe"
                          className="w-full bg-emerald-950 border border-emerald-800 focus:border-amber-400 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-emerald-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-emerald-300 mb-1">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            value={walkinEmail}
                            onChange={(e) => setWalkinEmail(e.target.value)}
                            placeholder="john@example.com"
                            className="w-full bg-emerald-950 border border-emerald-800 focus:border-amber-400 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-emerald-600 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase text-emerald-300 mb-1">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            required
                            value={walkinPhone}
                            onChange={(e) => setWalkinPhone(e.target.value)}
                            placeholder="08012345678"
                            className="w-full bg-emerald-950 border border-emerald-800 focus:border-amber-400 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-emerald-600 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-emerald-300 mb-1">
                        Attendance Mode
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setWalkinType("in-person")}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                            walkinType === "in-person"
                              ? "bg-amber-400/20 text-amber-300 border-amber-400/60"
                              : "bg-emerald-950 text-emerald-300 border-emerald-800 hover:border-emerald-700"
                          }`}
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Physical (Ikeja)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setWalkinType("virtual")}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                            walkinType === "virtual"
                              ? "bg-amber-400/20 text-amber-300 border-amber-400/60"
                              : "bg-emerald-950 text-emerald-300 border-emerald-800 hover:border-emerald-700"
                          }`}
                        >
                          <Globe2 className="w-3.5 h-3.5" />
                          <span>Virtual Stream</span>
                        </button>
                      </div>
                    </div>

                    {error && showWalkinForm && (
                      <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={walkinLoading}
                      className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-amber-400 text-emerald-950 hover:bg-yellow-300 flex items-center justify-center gap-1.5 transition-all"
                    >
                      {walkinLoading ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-emerald-950 border-t-transparent rounded-full animate-spin" />
                          <span>Creating Attendance...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Register &amp; Complete Check-In</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* Usher Desk Toggle */}
              <div className="pt-4 border-t border-emerald-800 flex items-center justify-between text-xs text-emerald-300">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Door Volunteer / Usher Mode</span>
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={usherMode}
                    onChange={(e) => setUsherMode(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-emerald-950 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-emerald-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-400"></div>
                </label>
              </div>
            </div>
          ) : (
            /* SUCCESS ATTENDANCE CONFIRMATION CARD */
            <div className="p-6 sm:p-8 rounded-3xl bg-emerald-900/90 border-2 border-amber-400/70 shadow-2xl space-y-6 text-center backdrop-blur-xl animate-fadeIn">
              {/* Checkmark Celebration Icon */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-800/80 border-2 border-amber-400 mx-auto flex items-center justify-center shadow-lg shadow-amber-400/20">
                <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-amber-300" />
              </div>

              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  {alreadyCheckedIn ? "Already Checked In" : "Attendance Confirmed"}
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Welcome, {matchedRecord.full_name}!
                </h2>
                <p className="text-xs sm:text-sm text-emerald-200">
                  {alreadyCheckedIn
                    ? "Your attendance was already recorded earlier. We are excited to have you!"
                    : "You are checked in for Kingdom Wealth Summit 2026. Have a wonderful and impactful session!"}
                </p>
              </div>

              {/* Attendee Details Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-left space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-900 pb-2.5 text-xs">
                  <span className="text-emerald-400">Reference Code:</span>
                  <span className="font-mono font-bold text-amber-300 text-sm">
                    {matchedRecord.reference_code}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-emerald-900 pb-2.5 text-xs">
                  <span className="text-emerald-400">Attendance Mode:</span>
                  <span className="font-bold text-white flex items-center gap-1">
                    {matchedRecord.attendance_type === "in-person" ? (
                      <>
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>Physical (The Philippi Centre)</span>
                      </>
                    ) : (
                      <>
                        <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Virtual Global Stream</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-emerald-900 pb-2.5 text-xs">
                  <span className="text-emerald-400">Check-In Time:</span>
                  <span className="font-semibold text-emerald-200 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      {matchedRecord.checked_in_at
                        ? new Date(matchedRecord.checked_in_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Just now"}
                    </span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-0.5">
                  <span className="text-emerald-400">Email:</span>
                  <span className="font-mono text-emerald-200 truncate max-w-[200px]">
                    {matchedRecord.email}
                  </span>
                </div>
              </div>

              {/* Usher Countdown Pill */}
              {usherMode && countdown !== null && (
                <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold">
                  Usher Mode: Resetting for next person in {countdown}s...
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <Link
                  href="/journal"
                  className="w-full py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider bg-emerald-800 hover:bg-emerald-700 text-white border border-emerald-600 flex items-center justify-center gap-2 transition-all shadow-lg"
                >
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Open Kingdom Wealth E-Journal</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={handleReset}
                  className="w-full py-3 rounded-2xl font-bold text-xs uppercase tracking-wider text-amber-300 hover:text-white bg-emerald-950 border border-emerald-800 hover:border-amber-400/50 flex items-center justify-center gap-1.5 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Check In Another Attendee</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick Help Footer */}
          <div className="text-center text-xs text-emerald-400/80 space-y-1">
            <p>
              Need assistance? Speak with any usher at the entrance or email{" "}
              <a href="mailto:support@finishrichafrica.com" className="text-amber-300 underline">
                support@finishrichafrica.com
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
